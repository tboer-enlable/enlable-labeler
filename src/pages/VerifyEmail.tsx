
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { MailCheck } from 'lucide-react';

const VerifyEmail = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  <MailCheck className="h-12 w-12 text-enlable-500" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Verify your email</CardTitle>
              <CardDescription className="text-center">
                We've sent a verification email to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-sm text-gray-600 mb-6">
                Please check your email and click on the verification link to complete your registration.
                If you don't see the email, check your spam folder.
              </p>
              <div className="py-4 px-6 bg-gray-50 rounded-md border border-gray-100 text-sm text-gray-600">
                <p>Once verified, you can <Link to="/login" className="text-enlable-600 hover:text-enlable-800 font-medium">sign in</Link> to your account.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-enlable-600"
                asChild
              >
                <Link to="/login">
                  Return to login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
