
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CTASection = () => {
  const { user } = useAuth();
  
  // Determine target route
  const targetPath = user ? '/labeler' : '/signup';
  const buttonText = user ? "Go to Labeler" : "Get Started for Free";

  return (
    <section className="bg-enlable-500 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start classifying your text data?
          </h2>
          <p className="text-xl text-enlable-50 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are streamlining their text classification workflow with Enlable.
          </p>
          <Link to={targetPath} className="inline-block">
            <button
              className="bg-white text-enlable-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full hover:shadow-lg transition-all flex items-center justify-center"
              type="button"
              aria-label={buttonText}
            >
              {buttonText} 
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
