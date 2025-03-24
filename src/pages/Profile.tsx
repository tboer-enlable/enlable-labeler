
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useUsage, PRICE_PER_MILLION_INPUT_TOKENS, PRICE_PER_MILLION_OUTPUT_TOKENS } from '@/contexts/UsageContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Euro, User, CreditCard, Clock, BarChart, History } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, updateBalance } = useAuth();
  const { usageSummary } = useUsage();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    return null; // This page requires authentication, so Layout will redirect
  }

  // For chart data - convert usage history to chart format and add dates
  const usageChartData = usageSummary.history.map(item => {
    const date = new Date(item.date);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      inputTokens: item.inputTokens / 1000, // Convert to thousands for better display
      outputTokens: item.outputTokens / 1000,
      cost: item.cost
    };
  }).slice(-7); // Only show last 7 data points

  const handleTopUp = async () => {
    const amountNumber = parseFloat(amount);
    
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Record transaction in Supabase
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount_eur: amountNumber,
          description: 'Account top-up'
        });
      
      if (transactionError) {
        throw transactionError;
      }
      
      // Update user balance
      const newBalance = user.balance + amountNumber;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance_eur: newBalance })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update user balance in context
      updateBalance(newBalance);
      
      toast.success(`Successfully added €${amountNumber.toFixed(2)} to your account`);
      setAmount('');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout requireAuth>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Your Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Account Info Card */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg font-medium text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                    <p className="text-lg font-medium text-green-600">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Balance Card */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Euro className="h-5 w-5 mr-2 text-gray-500" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-enlable-700">€{user.balance.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Your account balance is used for token usage costs.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-enlable-500 hover:bg-enlable-600" onClick={() => document.getElementById('top-up-tab')?.click()}>
                  Top Up Balance
                </Button>
              </CardFooter>
            </Card>
            
            {/* Usage Summary Card */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-gray-500" />
                  Usage Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Input Tokens</p>
                    <p className="text-lg font-medium text-gray-900">{usageSummary.totalInputTokens.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Output Tokens</p>
                    <p className="text-lg font-medium text-gray-900">{usageSummary.totalOutputTokens.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Cost</p>
                    <p className="text-lg font-medium text-enlable-600">€{usageSummary.totalCost.toFixed(4)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="usage" className="mb-10">
            <TabsList className="mb-6">
              <TabsTrigger value="usage" className="text-base px-6 py-2.5">
                <BarChart className="h-4 w-4 mr-2" />
                Usage Analytics
              </TabsTrigger>
              <TabsTrigger value="payment-history" className="text-base px-6 py-2.5">
                <History className="h-4 w-4 mr-2" />
                Payment History
              </TabsTrigger>
              <TabsTrigger value="top-up" id="top-up-tab" className="text-base px-6 py-2.5">
                <CreditCard className="h-4 w-4 mr-2" />
                Top Up Balance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="usage" className="mt-0">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Token Usage Overview</CardTitle>
                  <CardDescription>
                    View your token usage over time. Pricing: €{PRICE_PER_MILLION_INPUT_TOKENS} per million input tokens and €{PRICE_PER_MILLION_OUTPUT_TOKENS} per million output tokens.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usageChartData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={usageChartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="inputTokens" 
                            name="Input Tokens (K)" 
                            stackId="1" 
                            stroke="#4096ff" 
                            fill="#bae0fd" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="outputTokens" 
                            name="Output Tokens (K)" 
                            stackId="1" 
                            stroke="#1890ff" 
                            fill="#3aabf7" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center flex-col">
                      <Clock className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500">No usage data available yet.</p>
                      <p className="text-gray-400 text-sm">Start using the labeler to see your usage statistics.</p>
                    </div>
                  )}
                </CardContent>
                {usageSummary.history.length > 0 && (
                  <div className="border-t border-gray-200">
                    <div className="px-6 py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Usage</h3>
                      <div className="overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Input Tokens
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Output Tokens
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cost
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {usageSummary.history.slice(-5).reverse().map((usage, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(usage.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {usage.inputTokens.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {usage.outputTokens.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-enlable-600 font-medium">
                                  €{usage.cost.toFixed(4)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="payment-history" className="mt-0">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View your recent payments and balance changes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60 flex items-center justify-center flex-col">
                    <History className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">No payment history available.</p>
                    <p className="text-gray-400 text-sm">Your payment history will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="top-up" className="mt-0">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Top Up Your Balance</CardTitle>
                  <CardDescription>
                    Add funds to your account to use for text classification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (EUR)</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Euro className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="amount"
                          type="number"
                          min="1"
                          step="1"
                          placeholder="50"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-gray-500">Suggested amounts:</p>
                      <div className="flex flex-wrap gap-2">
                        {[10, 20, 50, 100, 200].map((value) => (
                          <Button
                            key={value}
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-[80px]"
                            onClick={() => setAmount(value.toString())}
                          >
                            €{value}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        onClick={handleTopUp}
                        disabled={isProcessing || !amount}
                        className="w-full bg-enlable-500 hover:bg-enlable-600 h-12 text-base"
                      >
                        {isProcessing ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </div>
                        ) : (
                          'Top Up Balance'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
