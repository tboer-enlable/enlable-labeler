
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CTASection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/labeler');
    } else {
      navigate('/signup');
    }
  };

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
          <Button
            className="bg-white text-enlable-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full hover:shadow-lg transition-all"
            onClick={handleGetStarted}
            type="button"
            aria-label={user ? "Go to Labeler" : "Get Started for Free"}
          >
            {user ? "Go to Labeler" : "Get Started for Free"} 
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
