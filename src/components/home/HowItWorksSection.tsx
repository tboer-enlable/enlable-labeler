
import React from 'react';
import { Upload, Tag, Download } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Our intuitive 3-step process makes text classification effortless
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-enlable-100 rounded-lg flex items-center justify-center mb-6 text-enlable-600">
              <Upload className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Upload Files</h3>
            <p className="text-gray-600">
              Upload your input text, categories with descriptions, and examples for classification.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-enlable-100 rounded-lg flex items-center justify-center mb-6 text-enlable-600">
              <Tag className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Label Text</h3>
            <p className="text-gray-600">
              Our AI model analyzes your data and assigns the most appropriate category to each text.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="h-14 w-14 bg-enlable-100 rounded-lg flex items-center justify-center mb-6 text-enlable-600">
              <Download className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Download Results</h3>
            <p className="text-gray-600">
              Download your classified text as an Excel file with text and corresponding labels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
