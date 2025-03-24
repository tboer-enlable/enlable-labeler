
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { ArrowRight, Tag, Upload, Download, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/labeler');
    } else {
      navigate('/signup');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_#e0f2fe,_transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-enlable-600 bg-enlable-50 rounded-full animate-fade-in">
              Powered by advanced AI
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight animate-fade-up">
              Text Classification 
              <span className="text-enlable-600 mx-2">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <span className="font-semibold text-gray-800">Labels Enable.</span> Classify your text data with precision using our AI-powered tool. Fast, accurate, and user-friendly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Button
                className="bg-enlable-500 hover:bg-enlable-600 text-white px-8 py-6 text-lg rounded-full hover:shadow-lg transition-all"
                onClick={handleGetStarted}
                type="button"
              >
                {user ? "Go to Labeler" : "Get Started"} 
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {!user && (
                <Button
                  variant="outline"
                  className="border-enlable-200 hover:border-enlable-300 text-enlable-600 px-8 py-6 text-lg rounded-full hover:bg-enlable-50"
                  onClick={handleSignIn}
                  type="button"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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

      {/* Features Section */}
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

      {/* CTA Section */}
      <section className="bg-enlable-500 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to start classifying your text data?
            </h2>
            <p className="text-xl text-enlable-50 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are streamlining their text classification workflow with Enlable.
            </p>
            <Button
              className="bg-white text-enlable-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full hover:shadow-lg transition-all"
              onClick={handleGetStarted}
              type="button"
            >
              {user ? "Go to Labeler" : "Get Started for Free"} 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
