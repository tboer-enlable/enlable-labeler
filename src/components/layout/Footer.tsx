
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-enlable-600 font-bold text-xl">Enlable</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Labels Enable. Advanced text classification leveraging the power of large language models.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/labeler" className="text-sm text-gray-600 hover:text-enlable-600">
                  Labeler Tool
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 hover:text-enlable-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-sm text-gray-600 hover:text-enlable-600">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-enlable-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-enlable-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-enlable-600">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-enlable-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-enlable-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Enlable. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
