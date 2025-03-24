
// Follow the Deno deploy runtime API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inputTexts, categories, examples } = await req.json();
    
    // Format the data for the GPT-4o prompt
    const table1 = inputTexts.map(text => `- ${text}`).join('\n');
    
    const table2 = categories.map((category, index) => 
      `- Category: ${category.category}, Description: ${category.categoryDescription}`
    ).join('\n');
    
    const table3 = examples.map(example => 
      `- Example Text: ${example.exampleInputText}, Desired Category: ${example.desiredCategory}`
    ).join('\n');

    // Construct the prompt with the user's instructions
    const prompt = `You are a text classification algorithm.

The user will provide you with 3 tables. Table 1 contains one column named input text. Under this column are one or more user input text instances that have to be categorized. Table 2 contains 2 columns, named category and category description. Under the column category you will find the different categories that the user has provided. Under the column category description you will find the descriptions that the user has given for each category. Table 3 contains 2 columns named example input text and desired category. Under the column example input text you will find examples of input text and under the column desired category you will find the corresponding category that the user thinks fits best.

For each input text instance, out of the categories that the user has provided, find the category that fits best. Be sure to also use the category descriptions for this.

Only one category may be picked per input text instance.

Output should be a table with 2 columns: Input text instance and category. Under the column input text instance should be each input text instance the user has provided. Under the column category should be the category the best fitting category.

Here follows the user input:

Table 1: 
${table1}

Table 2: 
${table2}

Table 3: 
${table3}

Respond with ONLY an array of category assignments in JSON format where each element is an object with "text" and "category" fields. Nothing else.`;

    console.log("Sending request to OpenAI with prompt:", prompt);

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a precise text classification assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2, // Lower temperature for more deterministic results
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(`OpenAI API error: ${data.error?.message || JSON.stringify(data)}`);
    }

    const aiResponse = data.choices[0].message.content;
    
    // Try to extract JSON from the response
    let results;
    try {
      // First, try to parse the entire response as JSON
      results = JSON.parse(aiResponse);
    } catch (e) {
      // If that fails, try to extract JSON from the response text
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          results = JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          console.error("Failed to parse extracted JSON:", innerError);
          throw new Error("The AI response couldn't be parsed as JSON");
        }
      } else {
        console.error("No JSON array found in response:", aiResponse);
        throw new Error("The AI response didn't contain a valid JSON array");
      }
    }
    
    // Calculate token usage
    const inputTokenCount = prompt.length / 4; // Rough estimate: 1 token ≈ 4 characters
    const outputTokenCount = aiResponse.length / 4;
    
    return new Response(JSON.stringify({
      results,
      usage: {
        inputTokens: Math.ceil(inputTokenCount),
        outputTokens: Math.ceil(outputTokenCount)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in classify-text function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
