'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  // This effect will redirect the user to the home page if they are already logged in.
  // This prevents an authenticated user from seeing the login page if they manually navigate to /login.
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);


  // While checking auth state, don't show the login button to avoid flashes
  if (loading || user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary">
              Iliad Social Spark
            </h1>
          <p className="text-muted-foreground">
            Sign in to access your AI-powered social media toolkit.
          </p>
        </div>
        <div className="w-full">
            <Button onClick={signIn} disabled={loading} className="w-full">
                Sign in with Google
            </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
            Access is restricted to authorized team members.
        </p>
      </div>
    </div>
  );
}