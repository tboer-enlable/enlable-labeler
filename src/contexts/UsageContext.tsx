
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Usage data types
export interface UsageData {
  date: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface UsageSummary {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  history: UsageData[];
}

// Pricing constants
export const PRICE_PER_MILLION_INPUT_TOKENS = 5; // euros
export const PRICE_PER_MILLION_OUTPUT_TOKENS = 20; // euros

// Context type
interface UsageContextType {
  usageSummary: UsageSummary;
  calculateTokenCost: (inputTokens: number, outputTokens: number) => { 
    inputCost: number; 
    outputCost: number; 
    totalCost: number 
  };
  addUsage: (inputTokens: number, outputTokens: number) => void;
  estimateTokenCount: (text: string) => number;
}

// Create context
const UsageContext = createContext<UsageContextType>({
  usageSummary: { totalInputTokens: 0, totalOutputTokens: 0, totalCost: 0, history: [] },
  calculateTokenCost: () => ({ inputCost: 0, outputCost: 0, totalCost: 0 }),
  addUsage: () => {},
  estimateTokenCount: () => 0,
});

// Create a hook to use the usage context
export const useUsage = () => useContext(UsageContext);

// Provider component
export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateBalance } = useAuth();
  const [usageSummary, setUsageSummary] = useState<UsageSummary>({
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    history: [],
  });

  // Load usage data from local storage when user changes
  useEffect(() => {
    if (user) {
      try {
        const storedUsage = localStorage.getItem(`enlable_usage_${user.id}`);
        if (storedUsage) {
          setUsageSummary(JSON.parse(storedUsage));
        }
      } catch (error) {
        console.error('Error loading usage data from local storage:', error);
      }
    } else {
      // Reset when user logs out
      setUsageSummary({
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalCost: 0,
        history: [],
      });
    }
  }, [user]);

  // Save usage data to local storage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`enlable_usage_${user.id}`, JSON.stringify(usageSummary));
    }
  }, [usageSummary, user]);

  // Calculate cost for tokens
  const calculateTokenCost = (inputTokens: number, outputTokens: number) => {
    const inputCost = (inputTokens / 1000000) * PRICE_PER_MILLION_INPUT_TOKENS;
    const outputCost = (outputTokens / 1000000) * PRICE_PER_MILLION_OUTPUT_TOKENS;
    const totalCost = inputCost + outputCost;
    
    return {
      inputCost: parseFloat(inputCost.toFixed(4)),
      outputCost: parseFloat(outputCost.toFixed(4)),
      totalCost: parseFloat(totalCost.toFixed(4))
    };
  };

  // Add usage data
  const addUsage = (inputTokens: number, outputTokens: number) => {
    if (!user) return;
    
    const { inputCost, outputCost, totalCost } = calculateTokenCost(inputTokens, outputTokens);
    
    const newUsageData: UsageData = {
      date: new Date().toISOString(),
      inputTokens,
      outputTokens,
      cost: totalCost
    };
    
    setUsageSummary(prev => {
      const newSummary = {
        totalInputTokens: prev.totalInputTokens + inputTokens,
        totalOutputTokens: prev.totalOutputTokens + outputTokens,
        totalCost: parseFloat((prev.totalCost + totalCost).toFixed(4)),
        history: [...prev.history, newUsageData],
      };
      
      return newSummary;
    });
    
    // Deduct cost from user balance
    if (user.balance) {
      updateBalance(user.balance - totalCost);
    }
  };

  // Estimate token count for a given text
  // This is a very simplistic estimation - in production use a proper tokenizer
  const estimateTokenCount = (text: string) => {
    // Rough estimate: 1 token ≈ 4 characters in English
    return Math.ceil(text.length / 4);
  };

  // Context value
  const value = {
    usageSummary,
    calculateTokenCost,
    addUsage,
    estimateTokenCount
  };

  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
};
