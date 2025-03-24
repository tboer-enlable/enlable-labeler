
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  addUsage: (inputTokens: number, outputTokens: number, classificationId?: string) => Promise<void>;
  estimateTokenCount: (text: string) => number;
}

// Create context
const UsageContext = createContext<UsageContextType>({
  usageSummary: { totalInputTokens: 0, totalOutputTokens: 0, totalCost: 0, history: [] },
  calculateTokenCost: () => ({ inputCost: 0, outputCost: 0, totalCost: 0 }),
  addUsage: async () => {},
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

  // Load usage data from Supabase when user changes
  useEffect(() => {
    if (user) {
      fetchUsageData();
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

  // Fetch usage data from Supabase
  const fetchUsageData = async () => {
    if (!user) return;
    
    try {
      // Get total input tokens
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('input_tokens_used, output_tokens_used')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      // Get usage history
      const { data: usageData, error: usageError } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (usageError) {
        throw usageError;
      }
      
      // Calculate total cost
      const totalCost = calculateTotalCostFromUsageLogs(usageData || []);
      
      // Update usage summary
      setUsageSummary({
        totalInputTokens: profileData?.input_tokens_used || 0,
        totalOutputTokens: profileData?.output_tokens_used || 0,
        totalCost,
        history: (usageData || []).map(log => ({
          date: log.created_at,
          inputTokens: log.input_tokens,
          outputTokens: log.output_tokens,
          cost: log.cost_eur
        }))
      });
    } catch (error) {
      console.error('Error loading usage data from Supabase:', error);
    }
  };

  // Calculate total cost from usage logs
  const calculateTotalCostFromUsageLogs = (logs: any[]) => {
    return logs.reduce((sum, log) => sum + (log.cost_eur || 0), 0);
  };

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
  const addUsage = async (inputTokens: number, outputTokens: number, classificationId?: string) => {
    if (!user) return;
    
    const { inputCost, outputCost, totalCost } = calculateTokenCost(inputTokens, outputTokens);
    
    try {
      // Add usage log
      const { error: logError } = await supabase
        .from('usage_logs')
        .insert({
          user_id: user.id,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          cost_eur: totalCost,
          classification_id: classificationId
        });
      
      if (logError) {
        throw logError;
      }
      
      // Update user profile tokens
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('input_tokens_used, output_tokens_used, balance_eur')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      const newInputTotal = (profileData?.input_tokens_used || 0) + inputTokens;
      const newOutputTotal = (profileData?.output_tokens_used || 0) + outputTokens;
      const newBalance = (profileData?.balance_eur || 0) - totalCost;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          input_tokens_used: newInputTotal,
          output_tokens_used: newOutputTotal,
          balance_eur: newBalance
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Refresh usage data
      await fetchUsageData();
      
      // Update user balance in auth context
      if (updateBalance) {
        updateBalance(newBalance);
      }
    } catch (error) {
      console.error('Error recording usage:', error);
      throw error;
    }
  };

  // Estimate token count for a given text
  // This is a simplistic estimation - in production use a proper tokenizer
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
