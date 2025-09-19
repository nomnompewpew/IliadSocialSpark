'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrivacyPolicyContent } from '@/components/legal/privacy-policy-content';
import { TermsOfServiceContent } from '@/components/legal/terms-of-service-content';


export default function LoginPage() {
  const { signIn, loading, user } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    // If the user is authenticated, redirect them to the main page.
    if (user) {
      window.location.href = '/';
    }
  }, [user]);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signIn();
      // On successful sign-in, the AuthProvider's user state will update,
      // and the useEffect above will trigger the redirect.
    } catch (error: any)
    {
      console.error("Sign-in error:", error.code, error.message);
      if (error.code === 'auth/configuration-not-found') {
        setAuthError(
          "Google Sign-In is not enabled for this Firebase project. " +
          "Please go to your Firebase Console -> Authentication -> Sign-in method -> Add new provider, and enable Google."
        );
      } else {
        setAuthError("An unexpected error occurred during sign-in. Please try again.");
      }
    }
  };
  
  // Render null while checking for user to prevent flash of login page if already authenticated.
  if (user) {
    return null;
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
        <div className="px-8 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our</p>
            <div className='flex justify-center gap-1'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                        <DialogTitle>Terms of Service</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[70vh] pr-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <TermsOfServiceContent />
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
                <span>and</span>
                <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                        <DialogTitle>Privacy Policy</DialogTitle>
                        </DialogHeader>
                         <ScrollArea className="h-[70vh] pr-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <PrivacyPolicyContent />
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>.
            </div>
        </div>
      </div>
    </div>
  );
}
