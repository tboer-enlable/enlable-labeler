
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Check for session changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          // Fetch user profile data from the profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: data.full_name || '',
              balance: data.balance_eur || 0,
              emailVerified: session.user.email_confirmed_at ? true : false,
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Fetch user profile data
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: data.full_name || '',
                balance: data.balance_eur || 0,
                emailVerified: session.user.email_confirmed_at ? true : false,
              });
            }
            setLoading(false);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Logged in successfully');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Account created! Please verify your email to continue.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error('Failed to log out');
    }
  };

  // Verify email function
  const verifyEmail = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      // Note: In Supabase, email verification is handled automatically
      // This function is kept for API consistency
      toast.success('Email verified successfully. Please log in.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update balance function
  const updateBalance = async (newBalance: number) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ balance_eur: newBalance })
          .eq('id', user.id);
        
        if (error) {
          throw error;
        }
        
        setUser({
          ...user,
          balance: newBalance
        });
      } catch (err: any) {
        console.error('Error updating balance:', err);
        toast.error('Failed to update balance');
      }
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
