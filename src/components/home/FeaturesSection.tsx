
import React from 'react';
import { Zap } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">
            Advanced capabilities for your text classification needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="text-enlable-500 mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced AI Labeling</h3>
            <p className="text-gray-600">
              Leverage the power of GPT-4o for accurate and nuanced text classification.
            </p>
          </div>
          
          {/* More features... */}
          <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="text-enlable-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h2" />
                <path d="M8 17h2" />
                <path d="M14 13h2" />
                <path d="M14 17h2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Excel Integration</h3>
            <p className="text-gray-600">
              Seamlessly import and export data with Excel files for easy integration with your workflow.
            </p>
          </div>
          
          <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="text-enlable-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customizable Categories</h3>
            <p className="text-gray-600">
              Define your own categories and descriptions to fit your specific classification needs.
            </p>
          </div>
          
          <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="text-enlable-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Example-Based Learning</h3>
            <p className="text-gray-600">
              Provide examples to guide the AI for more accurate classification based on your preferences.
            </p>
          </div>
          
          <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="text-enlable-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Data Handling</h3>
            <p className="text-gray-600">
              Your uploaded data is securely stored and processed with privacy as a priority.
            </p>
          </div>
          
          <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="text-enlable-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Usage Analytics</h3>
            <p className="text-gray-600">
              Track your token usage and costs with detailed analytics in your user profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
