
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  MenuIcon,
  XIcon,
  User,
  LogOut,
  FileText,
  Home,
  Tag,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Labeler', path: '/labeler', icon: Tag },
    { name: 'Pricing', path: '/pricing', icon: DollarSign },
    { name: 'Documentation', path: '/docs', icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-enlable-600 font-bold text-xl mr-1">Enlable</span>
              <span className="hidden md:inline text-gray-600 text-sm font-medium">| Labels Enable</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-enlable-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/profile"
                  className="flex items-center text-enlable-600 hover:text-enlable-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4 mr-1" />
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-enlable-600"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  size="sm"
                  className="bg-enlable-500 hover:bg-enlable-600 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link
                to="/profile"
                className="text-enlable-600 hover:text-enlable-700 px-3 py-2 rounded-md text-sm font-medium mr-2"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-enlable-600 focus:outline-none"
            >
              {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out pt-16",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center text-gray-600 hover:text-enlable-600 hover:bg-gray-50 block px-3 py-4 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full text-left text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-4 rounded-md text-base font-medium"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          ) : (
            <div className="space-y-2 px-3 py-4">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button
                className="w-full justify-center bg-enlable-500 hover:bg-enlable-600"
                onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
