
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase, InputTextData, CategoryData, ExampleData, LabeledData } from '@/contexts/DatabaseContext';
import { useUsage, PRICE_PER_MILLION_INPUT_TOKENS, PRICE_PER_MILLION_OUTPUT_TOKENS } from '@/contexts/UsageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Tag, Download, AlertTriangle, FileText, Info, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const Labeler = () => {
  const { user } = useAuth();
  const { 
    inputTextData, 
    categoryData, 
    exampleData, 
    labeledData,
    uploadInputTextFile, 
    uploadCategoryFile, 
    uploadExampleFile, 
    storeLabeledData,
    isProcessing,
    setIsProcessing
  } = useDatabase();
  const { estimateTokenCount, calculateTokenCost, addUsage } = useUsage();
  
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [exampleFile, setExampleFile] = useState<File | null>(null);
  
  const [inputTokenCount, setInputTokenCount] = useState(0);
  const [outputTokenCount, setOutputTokenCount] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);

  // Reset token counts when user data changes
  useEffect(() => {
    if (inputTextData && categoryData && exampleData) {
      // Calculate input tokens (estimate)
      let totalInputText = '';
      
      // Add all input text
      inputTextData.inputText.forEach(text => {
        totalInputText += text + ' ';
      });
      
      // Add all category names and descriptions
      categoryData.category.forEach((cat, index) => {
        totalInputText += cat + ' ' + categoryData.categoryDescription[index] + ' ';
      });
      
      // Add all examples
      exampleData.exampleInputText.forEach((text, index) => {
        totalInputText += text + ' ' + exampleData.desiredCategory[index] + ' ';
      });
      
      // Add prompt template tokens (approximation)
      totalInputText += 'You are a text classification algorithm. The user will provide you with 3 tables. Table 1 contains one column named input text. Under this column are one or more user input text instances that have to be categorized. Table 2 contains 2 columns, named category and category description. Table 3 contains 2 columns named example input text and desired category.';
      
      // Estimate token count
      const tokenCount = estimateTokenCount(totalInputText);
      setInputTokenCount(tokenCount);
      
      // Reset output tokens if we're not processing yet
      if (!isProcessing && !processingComplete) {
        setOutputTokenCount(0);
      }
    } else {
      setInputTokenCount(0);
      setOutputTokenCount(0);
    }
  }, [inputTextData, categoryData, exampleData, isProcessing, processingComplete, estimateTokenCount]);

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputFile(file);
    }
  };

  const handleCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryFile(file);
    }
  };

  const handleExampleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExampleFile(file);
    }
  };

  const handleInputFileUpload = async () => {
    if (inputFile) {
      await uploadInputTextFile(inputFile);
      setInputFile(null);
      
      // Reset the input element
      const inputElement = document.getElementById('input-file') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    } else {
      toast.error('Please select a file to upload');
    }
  };

  const handleCategoryFileUpload = async () => {
    if (categoryFile) {
      await uploadCategoryFile(categoryFile);
      setCategoryFile(null);
      
      // Reset the input element
      const inputElement = document.getElementById('category-file') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    } else {
      toast.error('Please select a file to upload');
    }
  };

  const handleExampleFileUpload = async () => {
    if (exampleFile) {
      await uploadExampleFile(exampleFile);
      setExampleFile(null);
      
      // Reset the input element
      const inputElement = document.getElementById('example-file') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    } else {
      toast.error('Please select a file to upload');
    }
  };

  const handleLabelData = async () => {
    if (!inputTextData || !categoryData || !exampleData) {
      toast.error('Please upload all required files before labeling');
      return;
    }

    if (!user || user.balance <= 0) {
      toast.error('Please top up your account balance before labeling');
      return;
    }

    const { inputCost } = calculateTokenCost(inputTokenCount, 0);
    if (inputCost > user.balance) {
      toast.error('Insufficient balance for this operation');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingComplete(false);
      
      // Prepare data for the edge function
      const data = {
        inputTexts: inputTextData.inputText,
        categories: categoryData.category.map((cat, index) => ({
          category: cat,
          categoryDescription: categoryData.categoryDescription[index]
        })),
        examples: exampleData.exampleInputText.map((text, index) => ({
          exampleInputText: text,
          desiredCategory: exampleData.desiredCategory[index]
        }))
      };
      
      // Call the Supabase edge function
      const { data: responseData, error } = await supabase.functions.invoke('classify-text', {
        body: data
      });
      
      if (error) {
        throw new Error(`Error calling classify-text function: ${error.message}`);
      }
      
      const { results, usage } = responseData;
      
      if (!results || !Array.isArray(results)) {
        throw new Error('Invalid response from classification function');
      }
      
      // Extract the labeled data
      const labeledData: LabeledData = {
        inputText: results.map(item => item.text),
        category: results.map(item => item.category)
      };
      
      // Store the labeled data
      const classificationId = await storeLabeledData(labeledData);
      
      // Set output token count from API response
      const actualOutputTokenCount = usage?.outputTokens || 0;
      setOutputTokenCount(actualOutputTokenCount);
      
      // Record usage
      await addUsage(inputTokenCount, actualOutputTokenCount, classificationId);
      
      setProcessingComplete(true);
      toast.success('Labeling complete');
    } catch (error: any) {
      console.error('Error labeling data:', error);
      toast.error(error.message || 'Error labeling data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResults = () => {
    if (!labeledData) {
      toast.error('No labeled data available to download');
      return;
    }

    try {
      // Create worksheet from labeled data
      const ws = XLSX.utils.aoa_to_sheet([
        ['input text', 'category'], // Header row
        ...labeledData.inputText.map((text, index) => [text, labeledData.category[index]])
      ]);

      // Create workbook and add worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Labeled Data');

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, 'labeled_data.xlsx');
      
      toast.success('Results downloaded successfully');
    } catch (error) {
      console.error('Error downloading results:', error);
      toast.error('Error downloading results. Please try again.');
    }
  };

  const { inputCost, outputCost, totalCost } = calculateTokenCost(inputTokenCount, outputTokenCount);

  return (
    <Layout requireAuth>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Text Labeler</h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload your files, label your text, and download the results.
          </p>

          {(!user || user.balance <= 0) && (
            <Alert className="mb-8 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-600">Low Balance</AlertTitle>
              <AlertDescription>
                Your account balance is low. Please top up your balance in your profile to use the labeling service.
                <Button
                  variant="link"
                  className="text-enlable-600 p-0 h-auto font-medium"
                  onClick={() => {
                    window.location.href = '/profile';
                  }}
                >
                  Go to Profile
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Input Text File Upload */}
            <Card className={`border ${inputTextData ? 'border-green-200 bg-green-50' : 'border-gray-200'} transition-colors`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-full ${inputTextData ? 'bg-green-100 text-green-600' : 'bg-enlable-100 text-enlable-600'}`}>
                    {inputTextData ? <CheckCircle className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                  </div>
                  <h3 className="text-lg font-medium ml-3">Input Text File</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Upload an Excel file with input text to be labeled.
                </p>
                
                {inputTextData ? (
                  <div className="text-sm mb-4">
                    <p className="font-medium text-gray-700">Uploaded File:</p>
                    <p className="text-gray-600">{inputTextData.inputText.length} text instances ready for labeling</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <input
                      id="input-file"
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleInputFileChange}
                    />
                    <label
                      htmlFor="input-file"
                      className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer w-full transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Select File
                    </label>
                    {inputFile && (
                      <p className="text-xs text-gray-600 mt-2 truncate">
                        Selected: {inputFile.name}
                      </p>
                    )}
                  </div>
                )}
                
                {!inputTextData && (
                  <Button
                    onClick={handleInputFileUpload}
                    disabled={!inputFile}
                    className="w-full bg-enlable-500 hover:bg-enlable-600"
                    size="sm"
                  >
                    Upload
                  </Button>
                )}
                {inputTextData && (
                  <div className="text-xs text-green-600 font-medium flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> File uploaded successfully
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category File Upload */}
            <Card className={`border ${categoryData ? 'border-green-200 bg-green-50' : 'border-gray-200'} transition-colors`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-full ${categoryData ? 'bg-green-100 text-green-600' : 'bg-enlable-100 text-enlable-600'}`}>
                    {categoryData ? <CheckCircle className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                  </div>
                  <h3 className="text-lg font-medium ml-3">Category File</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Upload an Excel file with categories and descriptions.
                </p>
                
                {categoryData ? (
                  <div className="text-sm mb-4">
                    <p className="font-medium text-gray-700">Uploaded File:</p>
                    <p className="text-gray-600">{categoryData.category.length} categories available</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <input
                      id="category-file"
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleCategoryFileChange}
                    />
                    <label
                      htmlFor="category-file"
                      className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer w-full transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Select File
                    </label>
                    {categoryFile && (
                      <p className="text-xs text-gray-600 mt-2 truncate">
                        Selected: {categoryFile.name}
                      </p>
                    )}
                  </div>
                )}
                
                {!categoryData && (
                  <Button
                    onClick={handleCategoryFileUpload}
                    disabled={!categoryFile}
                    className="w-full bg-enlable-500 hover:bg-enlable-600"
                    size="sm"
                  >
                    Upload
                  </Button>
                )}
                {categoryData && (
                  <div className="text-xs text-green-600 font-medium flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> File uploaded successfully
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Example File Upload */}
            <Card className={`border ${exampleData ? 'border-green-200 bg-green-50' : 'border-gray-200'} transition-colors`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-full ${exampleData ? 'bg-green-100 text-green-600' : 'bg-enlable-100 text-enlable-600'}`}>
                    {exampleData ? <CheckCircle className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                  </div>
                  <h3 className="text-lg font-medium ml-3">Example File</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Upload an Excel file with example text and desired categories.
                </p>
                
                {exampleData ? (
                  <div className="text-sm mb-4">
                    <p className="font-medium text-gray-700">Uploaded File:</p>
                    <p className="text-gray-600">{exampleData.exampleInputText.length} examples available</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <input
                      id="example-file"
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleExampleFileChange}
                    />
                    <label
                      htmlFor="example-file"
                      className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer w-full transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Select File
                    </label>
                    {exampleFile && (
                      <p className="text-xs text-gray-600 mt-2 truncate">
                        Selected: {exampleFile.name}
                      </p>
                    )}
                  </div>
                )}
                
                {!exampleData && (
                  <Button
                    onClick={handleExampleFileUpload}
                    disabled={!exampleFile}
                    className="w-full bg-enlable-500 hover:bg-enlable-600"
                    size="sm"
                  >
                    Upload
                  </Button>
                )}
                {exampleData && (
                  <div className="text-xs text-green-600 font-medium flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> File uploaded successfully
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Token Information Section */}
          {inputTextData && categoryData && exampleData && (
            <Card className="mb-8 border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center mb-2">
                    <Info className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Token Usage & Cost Estimate</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on your uploaded files, here's an estimate of token usage and costs.
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Input Tokens</p>
                      <p className="text-2xl font-semibold text-gray-900">{inputTokenCount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        €{PRICE_PER_MILLION_INPUT_TOKENS} per million tokens
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Output Tokens</p>
                      <p className="text-2xl font-semibold text-gray-900">{outputTokenCount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        €{PRICE_PER_MILLION_OUTPUT_TOKENS} per million tokens
                      </p>
                    </div>
                    <div className="bg-enlable-50 p-4 rounded-lg border border-enlable-100">
                      <p className="text-sm text-enlable-700 mb-1">Estimated Total Cost</p>
                      <p className="text-2xl font-semibold text-enlable-900">€{totalCost.toFixed(4)}</p>
                      <p className="text-xs text-enlable-600 mt-1">
                        Input: €{inputCost.toFixed(4)} | Output: €{outputCost.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  
                  {!processingComplete && outputTokenCount === 0 && (
                    <Alert className="mt-4 border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-700 text-sm">
                        This is only an estimate of input tokens. Output token count and final cost will be calculated after processing.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Button
              onClick={handleLabelData}
              disabled={!inputTextData || !categoryData || !exampleData || isProcessing || (user && user.balance <= 0)}
              className="flex-1 py-6 bg-enlable-500 hover:bg-enlable-600 flex items-center justify-center text-base"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  <Tag className="mr-2 h-5 w-5" />
                  Label Text
                </>
              )}
            </Button>
            
            <Button
              onClick={handleDownloadResults}
              disabled={!labeledData}
              variant="outline"
              className="flex-1 py-6 border-enlable-200 hover:bg-enlable-50 text-enlable-600 flex items-center justify-center text-base"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Results
            </Button>
          </div>

          {/* Results Preview */}
          {labeledData && (
            <div className="border rounded-lg overflow-hidden bg-white mb-10">
              <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Labeled Results Preview</h3>
                <span className="text-sm text-gray-500">{labeledData.inputText.length} items labeled</span>
              </div>
              <div className="overflow-auto max-h-80">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Input Text
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {labeledData.inputText.slice(0, 5).map((text, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-enlable-100 text-enlable-800">
                            {labeledData.category[index]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {labeledData.inputText.length > 5 && (
                  <div className="px-6 py-3 bg-gray-50 text-center text-sm text-gray-500">
                    Showing 5 of {labeledData.inputText.length} results. Download to see all.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Labeler;
