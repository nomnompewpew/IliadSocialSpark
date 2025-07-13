"use client";

import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            Iliad Social Spark
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
