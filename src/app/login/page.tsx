'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.021 35.596 44 30.032 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
)

export default function LoginPage() {
    const { user, signInWithGoogle, error, isSigningIn } = useAuth();
    
    const handleSignIn = async () => {
        await signInWithGoogle();
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                     <div className="flex items-center gap-2 justify-center mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold font-headline text-primary">
                        Iliad Social Spark
                        </h1>
                    </div>
                    <CardTitle className="text-2xl font-headline">Welcome</CardTitle>
                    <CardDescription>Sign in to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button onClick={handleSignIn} disabled={isSigningIn} className="w-full">
                         {isSigningIn ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <GoogleIcon />
                         )}
                        Sign in with Google
                    </Button>
                    {error && (
                         <div className="text-center text-sm font-medium text-destructive">
                            <p>{error}</p>
                         </div>
                    )}
                     {user && !user.email?.endsWith('@iliadmg.com') && (
                        <div className="text-center text-sm font-medium text-destructive">
                            <p>Access denied. This application is restricted to users with an @iliadmg.com email address.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
