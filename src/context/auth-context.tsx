'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Loader2, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
  isTeamMember: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Full-screen loader
const AuthLoader = () => (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Authenticating...</p>
        </div>
    </div>
);

// Access Denied component
const AccessDenied = ({ onSignOut }: { onSignOut: () => void }) => {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-6 text-center max-w-md p-4">
                <ShieldOff className="h-16 w-16 text-destructive" />
                <h1 className="text-3xl font-bold font-headline">Access Denied</h1>
                <p className="text-muted-foreground">
                    This application is restricted to authorized users.
                    Please sign in with an authorized account from a permitted domain.
                </p>
                <Button onClick={onSignOut} variant="outline">
                    Sign Out and Try Again
                </Button>
            </div>
        </div>
    );
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTeamMember, setIsTeamMember] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = ['/login', '/terms', '/privacy'];

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email || '';
        const isAuthorized = userEmail.endsWith('@iliadmg.com') || userEmail.endsWith('@radiorancho.com');

        if (isAuthorized) {
            setUser(user);
            setIsTeamMember(true);
        } else {
            setUser(null); // Explicitly nullify user if domain doesn't match
            setIsTeamMember(false);
        }
      } else {
        setUser(null);
        setIsTeamMember(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (loading) return; 

    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not authenticated and not on a public route, redirect to login.
    if (!user && !isPublicRoute) {
      router.push('/login');
    }

    // If user is authenticated and on the login page, redirect to home.
    if (user && pathname === '/login') {
        router.push('/');
    }
  }, [user, loading, pathname, router, publicRoutes]);

  const signIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the user state and the useEffect above will handle redirection.
    } catch (error) {
      console.error("Error during sign-in:", error);
      setLoading(false);
      throw error;
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will set user to null, and the useEffect will redirect to login.
    } catch (error) {
      console.error("Error during sign-out:", error);
      setLoading(false);
    }
  };

  const value = { user, loading, signIn, signOutUser, isTeamMember };
  
  if (loading) {
    return <AuthLoader />;
  }
  
  if (isTeamMember === false) {
    // Provide a valid context for the AccessDenied page to use signOut
    return (
        <AuthContext.Provider value={value}>
            <AccessDenied onSignOut={signOutUser} />
        </AuthContext.Provider>
    );
  }

  // If we are on a public route OR if we have a valid user, render children
  if (publicRoutes.includes(pathname) || (user && isTeamMember)) {
     return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
  }

  // Fallback case, typically shown briefly during redirects.
  return <AuthLoader />;
}
