import { Sparkles, X } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Iliad Social Spark',
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/40 bg-background/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2" tabIndex={-1} aria-hidden="true">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">
              Iliad Social Spark
            </h1>
          </Link>
          <Button asChild variant="ghost" className="h-12 w-12 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Link href="/login" aria-label="Close and return to sign in">
              <X className="h-8 w-8" />
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="prose prose-sm dark:prose-invert max-w-4xl mx-auto">
            {children}
        </div>
      </main>
      <footer className="py-4 border-t border-border/40">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} The Calton Group. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
