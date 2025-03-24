
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Tag, Download, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Documentation = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 mb-8">
            Learn how to use Enlable's text classification tool effectively.
          </p>

          <Tabs defaultValue="getting-started" className="mb-12">
            <TabsList className="mb-6 grid grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="getting-started" className="text-sm">Getting Started</TabsTrigger>
              <TabsTrigger value="file-format" className="text-sm">File Format</TabsTrigger>
              <TabsTrigger value="labeling" className="text-sm">Labeling Process</TabsTrigger>
              <TabsTrigger value="best-practices" className="text-sm">Best Practices</TabsTrigger>
              <TabsTrigger value="faq" className="text-sm">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started with Enlable</h2>
                  
                  <div className="prose max-w-none">
                    <p>
                      Welcome to Enlable, your tool for AI-powered text classification. Follow these steps to get started:
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">1. Create an Account</h3>
                    <p>
                      Sign up for an account and verify your email address to access the text labeling tool.
                    </p>
                    <Button asChild className="bg-enlable-500 hover:bg-enlable-600 mt-2">
                      <Link to="/signup">Create an Account</Link>
                    </Button>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">2. Top Up Your Balance</h3>
                    <p>
                      Add funds to your account to pay for token usage. Visit your profile page to top up your balance.
                    </p>
                    <Button asChild variant="outline" className="border-enlable-200 hover:border-enlable-300 text-enlable-600 mt-2">
                      <Link to="/profile">Go to Profile</Link>
                    </Button>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">3. Prepare Your Excel Files</h3>
                    <p>
                      You'll need to prepare three Excel files:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li><strong>Input Text File</strong>: Contains one column named "input text" with the text instances you want to classify.</li>
                      <li><strong>Category File</strong>: Contains two columns named "category" and "category description" defining your classification categories.</li>
                      <li><strong>Example File</strong>: Contains two columns named "example input text" and "desired category" with example classifications.</li>
                    </ul>
                    <p className="mt-3">
                      Check the "File Format" tab for more details on how to structure your files.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">4. Upload Your Files</h3>
                    <p>
                      Go to the Labeler page and upload your three Excel files.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">5. Label Your Text</h3>
                    <p>
                      Click the "Label Text" button to start the classification process. The AI will analyze your data and assign the most appropriate category to each text instance.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">6. Download Results</h3>
                    <p>
                      Once the labeling is complete, you can download the results as an Excel file with two columns: "input text" and "category".
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                      <div className="flex">
                        <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" />
                        <p className="text-blue-700 text-sm">
                          Ready to start? Go to the <Link to="/labeler" className="text-enlable-600 hover:text-enlable-800 font-medium">Labeler page</Link> to begin classifying your text.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="file-format">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">File Format Guidelines</h2>
                  
                  <div className="prose max-w-none">
                    <p>
                      Enlable requires three Excel files for text classification. Each file must follow a specific format to work correctly.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">Input Text File</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">Format: Excel (.xlsx or .xls)</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        This file contains the text instances you want to classify. It should have:
                      </p>
                      <ul className="list-disc pl-6 text-sm text-gray-600">
                        <li>A header row with a column named "input text"</li>
                        <li>One or more rows of text data under this column</li>
                      </ul>
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">input text</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">I love this product, it works great!</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">The customer service was terrible.</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">How do I reset my password?</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">Category File</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">Format: Excel (.xlsx or .xls)</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        This file defines the categories for classification. It should have:
                      </p>
                      <ul className="list-disc pl-6 text-sm text-gray-600">
                        <li>A header row with columns named "category" and "category description"</li>
                        <li>One or more rows with category names and descriptions</li>
                      </ul>
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">category</th>
                              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">category description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Positive</td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Positive sentiment or praise about a product or service</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Negative</td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Negative sentiment or complaints about a product or service</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Question</td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Questions or inquiries seeking information or help</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">Example File</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">Format: Excel (.xlsx or .xls)</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        This file provides examples to guide the AI for classification. It should have:
                      </p>
                      <ul className="list-disc pl-6 text-sm text-gray-600">
                        <li>A header row with columns named "example input text" and "desired category"</li>
                        <li>One or more rows with example texts and their corresponding categories</li>
                      </ul>
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">example input text</th>
                              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">desired category</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">This is the best service I've ever used!</td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Positive</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">I'm very disappointed with this product.</td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Negative</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">How can I contact customer support?</td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Question</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mt-6">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-amber-700 text-sm font-medium">Important Notes:</p>
                          <ul className="list-disc pl-6 text-sm text-amber-700 mt-1">
                            <li>The column names must match exactly as specified (case-insensitive)</li>
                            <li>Each file should be in Excel format (.xlsx or .xls)</li>
                            <li>Make sure there are no empty rows between data rows</li>
                            <li>Categories in the Example File should match those in the Category File</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="labeling">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">The Labeling Process</h2>
                  
                  <div className="prose max-w-none">
                    <p>
                      Enlable uses GPT-4o, a large language model, to classify your text data. Here's how the process works:
                    </p>
                    
                    <div className="mt-6 space-y-8">
                      <div className="flex">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-enlable-100 flex items-center justify-center text-enlable-600 mr-4">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Step 1: Upload Files</h3>
                          <p className="text-gray-600 mt-1">
                            Upload your three Excel files (Input Text, Categories, and Examples) to provide the AI with all the necessary information.
                          </p>
                          <p className="text-gray-600 mt-2">
                            After uploading, the system will estimate the token count and display the estimated cost based on the pricing model.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-enlable-100 flex items-center justify-center text-enlable-600 mr-4">
                          <Tag className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Step 2: AI Processing</h3>
                          <p className="text-gray-600 mt-1">
                            When you click "Label Text", the system sends the following information to the AI:
                          </p>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Your input text instances</li>
                            <li>Your defined categories and their descriptions</li>
                            <li>Your example classifications</li>
                            <li>System instructions guiding the AI on how to perform the classification</li>
                          </ul>
                          <p className="text-gray-600 mt-2">
                            The AI analyzes each text instance and assigns the most appropriate category based on the provided information.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-enlable-100 flex items-center justify-center text-enlable-600 mr-4">
                          <Download className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Step 3: Results</h3>
                          <p className="text-gray-600 mt-1">
                            After processing, the system displays:
                          </p>
                          <ul className="list-disc pl-6 mt-2">
                            <li>A preview of the labeled data</li>
                            <li>The actual token usage and cost</li>
                            <li>An option to download the complete results as an Excel file</li>
                          </ul>
                          <p className="text-gray-600 mt-2">
                            The final Excel file contains two columns: "input text" and "category", with each text instance paired with its assigned category.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-3">Behind the Scenes: AI Prompt</h3>
                    <p>
                      The AI uses the following instructions to guide its classification:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-3 text-sm text-gray-700 whitespace-pre-line">
                      You are a text classification algorithm.
                      
                      The user will provide you with 3 tables. Table 1 contains one column named input text. Under this column are one or more user input text instances that have to be categorized. Table 2 contains 2 columns, named category and category description. Under the column category you will find the different categories that the user has provided. Under the column category description you will find the descriptions that the user has given for each category. Table 3 contains 2 columns named example input text and desired category. Under the column example input text you will find examples of input text and under the column desired category you will find the corresponding category that the user thinks fits best.
                      
                      For each input text instance, out of the categories that the user has provided, find the category that fits best. Be sure to also use the category descriptions for this.
                      
                      Only one category may be picked per input text instance.
                      
                      Output should be a table with 2 columns: Input text instance and category. Under the column input text instance should be each input text instance the user has provided. Under the column category should be the category the best fitting category.
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                      <div className="flex">
                        <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" />
                        <p className="text-blue-700 text-sm">
                          Ready to try it out? Visit the <Link to="/labeler" className="text-enlable-600 hover:text-enlable-800 font-medium">Labeler page</Link> to start classifying your text.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="best-practices">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
                  
                  <div className="prose max-w-none">
                    <p>
                      Follow these best practices to get the most accurate and cost-effective results from Enlable:
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">Creating Effective Categories</h3>
                    <ul className="space-y-3">
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Be specific and clear</strong>: Write detailed category descriptions that clearly distinguish between categories.
                        </span>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Avoid overlap</strong>: Ensure categories don't have significant overlap in their definitions to reduce ambiguity.
                        </span>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Keep it balanced</strong>: Try to create categories that are at a similar level of specificity.
                        </span>
                      </li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">Providing Effective Examples</h3>
                    <ul className="space-y-3">
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Include diverse examples</strong>: Provide examples that cover the range of text styles and content you expect.
                        </span>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Include edge cases</strong>: Provide examples for texts that might be difficult to classify or could fall into multiple categories.
                        </span>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Balance examples</strong>: Provide roughly the same number of examples for each category.
                        </span>
                      </li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">Optimizing for Cost</h3>
                    <ul className="space-y-3">
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Batch process</strong>: Process larger batches of text at once rather than many small batches to optimize token usage.
                        </span>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Be concise</strong>: Keep category descriptions and examples concise while still being clear and effective.
                        </span>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Monitor usage</strong>: Keep track of your token usage and costs in your profile to optimize your approach over time.
                        </span>
                      </li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">Testing and Iteration</h3>
                    <ul className="space-y-3">
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Start small</strong>: For new classification tasks, start with a small batch to test your categories and examples.
                        </span>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Review results</strong>: Check the classification results and refine your categories or examples if necessary.
                        </span>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>
                          <strong>Iterate</strong>: Use feedback from results to improve your classification approach over time.
                        </span>
                      </li>
                    </ul>
                    
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-8">
                      <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1">
                          <path d="M9 12l2 2 4-4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        <p className="text-green-700 text-sm">
                          By following these best practices, you'll get more accurate classifications while optimizing your token usage and costs.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                  
                  <div className="divide-y">
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">What is the maximum file size I can upload?</h3>
                      <p className="text-gray-600">
                        You can upload Excel files up to 10MB in size. For larger datasets, consider splitting your data into multiple files and processing them in batches.
                      </p>
                    </div>
                    
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">How accurate is the text classification?</h3>
                      <p className="text-gray-600">
                        The accuracy depends on several factors, including the clarity of your category definitions, the quality of your examples, and the complexity of the classification task. In general, GPT-4o provides high-accuracy classifications, especially with well-defined categories and good examples.
                      </p>
                    </div>
                    
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">How many categories can I have?</h3>
                      <p className="text-gray-600">
                        There's no strict limit on the number of categories, but we recommend keeping it under 20 categories for best results. The more categories you have, the more important clear definitions and examples become.
                      </p>
                    </div>
                    
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">How many examples should I provide?</h3>
                      <p className="text-gray-600">
                        We recommend providing at least 3-5 examples per category. More complex or nuanced categories may benefit from additional examples. The quality of examples is more important than quantity.
                      </p>
                    </div>
                    
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Can I process texts in languages other than English?</h3>
                      <p className="text-gray-600">
                        Yes, GPT-4o supports multiple languages. You can classify text in most major languages. Just make sure your category names and descriptions are in the same language as your input text for best results.
                      </p>
                    </div>
                    
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">How is my data handled and stored?</h3>
                      <p className="text-gray-600">
                        Your data is stored securely in your account and is only used for the specific classification tasks you request. We do not use your data to train our models. Data is transmitted securely when sent to the AI processing service.
                      </p>
                    </div>
                    
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">What if I'm not satisfied with the classification results?</h3>
                      <p className="text-gray-600">
                        If you're not satisfied with the results, consider refining your category definitions and examples to better guide the AI. You can also contact our support team for assistance in optimizing your classification approach.
                      </p>
                    </div>
                    
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Is there a limit to how many text instances I can classify?</h3>
                      <p className="text-gray-600">
                        There's no limit as long as you have sufficient balance in your account to cover the token usage costs. For very large datasets, we recommend processing in batches to manage costs and review results incrementally.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-center text-gray-600">
                      Have more questions? Contact us at <a href="mailto:support@enlable.com" className="text-enlable-600 hover:text-enlable-800 font-medium">support@enlable.com</a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
