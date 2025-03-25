
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();

  // Determine target routes
  const primaryPath = user ? '/labeler' : '/signup';
  const primaryText = user ? "Go to Labeler" : "Get Started";

  return (
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
            <Link to={primaryPath} className="inline-block">
              <button
                className="bg-enlable-500 hover:bg-enlable-600 text-white px-8 py-6 text-lg rounded-full hover:shadow-lg transition-all flex items-center justify-center"
                type="button"
                aria-label={primaryText}
              >
                {primaryText} 
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            
            {!user && (
              <Link to="/login" className="inline-block">
                <button
                  className="border border-enlable-200 hover:border-enlable-300 text-enlable-600 px-8 py-6 text-lg rounded-full hover:bg-enlable-50 flex items-center justify-center"
                  type="button"
                  aria-label="Sign In"
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
