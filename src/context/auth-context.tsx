'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import LoginPage from '@/app/login/page';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isSigningIn: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const validDomain = 'iliadmg.com';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                 if (currentUser.email && currentUser.email.endsWith(`@${validDomain}`)) {
                    setUser(currentUser);
                } else {
                    // User is signed in but not from the correct domain, log them out.
                    signOut(auth);
                    setUser(null); 
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    const signInWithGoogle = async () => {
        setIsSigningIn(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userEmail = result.user.email;
            if (userEmail && userEmail.endsWith(`@${validDomain}`)) {
                // The onAuthStateChanged listener will handle setting the user
            } else {
                setError(`Access is restricted to @${validDomain} users.`);
                await signOut(auth);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in.');
            console.error("Auth Error:", err);
        } finally {
            setIsSigningIn(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } catch (err: any) {
            setError(err.message || 'Failed to sign out.');
        } finally {
            // onAuthStateChanged will set loading to false
        }
    };

    const value = { user, loading, error, isSigningIn, signInWithGoogle, logout };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Authenticating...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {user ? children : <LoginPage />}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
