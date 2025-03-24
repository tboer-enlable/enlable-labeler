
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user type
interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  emailVerified: boolean;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateBalance: (newBalance: number) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  verifyEmail: async () => {},
  resetPassword: async () => {},
  updateBalance: () => {},
});

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock API functions (replace with real implementation)
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock verification check
  if (email === 'unverified@example.com') {
    throw new Error('Please verify your email before logging in.');
  }
  
  // Return mock user data
  return {
    id: '1',
    email,
    name: 'John Doe',
    balance: 50.0,
    emailVerified: true
  };
};

const mockSignup = async (email: string, name: string, password: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Success
  return;
};

const mockVerifyEmail = async (token: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Success
  return;
};

const mockResetPassword = async (email: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Success
  return;
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('enlable_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Authentication error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await mockLogin(email, password);
      
      // Save user to localStorage
      localStorage.setItem('enlable_user', JSON.stringify(user));
      setUser(user);
      toast.success('Logged in successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      toast.error(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, name: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await mockSignup(email, name, password);
      toast.success('Account created! Please verify your email to continue.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      toast.error(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('enlable_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Verify email function
  const verifyEmail = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      await mockVerifyEmail(token);
      toast.success('Email verified successfully. Please log in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify email');
      toast.error(err instanceof Error ? err.message : 'Failed to verify email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await mockResetPassword(email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
      toast.error(err instanceof Error ? err.message : 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update balance function
  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      localStorage.setItem('enlable_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    verifyEmail,
    resetPassword,
    updateBalance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
