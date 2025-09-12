'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, ShieldAlert, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const { signIn, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [currentHostname, setCurrentHostname] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // This runs only on the client, after the component has mounted.
    setCurrentHostname(window.location.hostname);
  }, []);

  const handleSignIn = async () => {
    setAuthError(null);
    setUnauthorizedDomain(null);
    try {
      await signIn();
      // On successful sign-in, AuthProvider will handle redirecting to the main page.
    } catch (error: any)
    {
      console.error("Sign-in error:", error.code, error.message);
      if (error.code === 'auth/configuration-not-found') {
        setAuthError(
          "Google Sign-In is not enabled for this Firebase project. " +
          "Please go to your Firebase Console -> Authentication -> Sign-in method -> Add new provider, and enable Google."
        );
      } else if (error.code === 'auth/unauthorized-domain') {
        // This is the special case we want to handle prominently.
        setUnauthorizedDomain(window.location.hostname);
      } else {
        setAuthError("An unexpected error occurred during sign-in. Please try again.");
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard!',
        description: 'You can now paste the domain in Firebase.',
      });
    }, (err) => {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy domain to clipboard.',
        variant: 'destructive'
      })
    });
  };

  // If we have an unauthorized domain error, show a dedicated screen.
  if (unauthorizedDomain) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg border-destructive">
            <CardHeader>
                <div className='flex items-center gap-4'>
                    <ShieldAlert className="h-10 w-10 text-destructive flex-shrink-0"/>
                    <div>
                        <CardTitle className='text-destructive'>Domain Not Authorized</CardTitle>
                        <CardDescription>Your app's domain needs to be authorized in Firebase.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className='space-y-4'>
                <p>To fix this, please follow these steps:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Go to your Firebase Console: <strong>Authentication &gt; Settings &gt; Authorized domains</strong>.</li>
                    <li>Click <strong>"Add domain"</strong>.</li>
                    <li>Copy and paste the following domain into the text box:</li>
                </ol>
                <div className='bg-muted p-4 rounded-md font-mono text-center text-sm break-all'>
                    {unauthorizedDomain}
                </div>
                <Button onClick={() => window.location.reload()} className='w-full'>
                    I have added the domain, refresh page
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  // Default Login Page
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center space-y-6 p-4">
        <div className="flex flex-col items-center space-y-2 text-center">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary">
              Iliad Social Spark
            </h1>
          <p className="text-muted-foreground">
            Sign in to access your AI-powered social media toolkit.
          </p>
        </div>

        <div className="w-full pt-4">
            <Button onClick={handleSignIn} disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
        </div>
        {authError && (
          <div className="w-full p-4 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/50 flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-1" />
              <div className="flex-grow">
                <p className="font-semibold">Configuration Error</p>
                <p className="text-sm whitespace-pre-wrap">{authError}</p>
              </div>
          </div>
        )}
        <p className="px-8 text-center text-sm text-muted-foreground">
            Access is restricted to authorized team members.
        </p>
      </div>
    </div>
  );
}
