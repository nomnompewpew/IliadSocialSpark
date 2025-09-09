"use client";

import { useState } from 'react';
import { Sparkles, Save, FolderOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SaveJourneyDialog from '@/components/features/save-journey-dialog';
import LoadJourneyDialog from '@/components/features/load-journey-dialog';
import ErrorLogDialog from '@/components/features/error-log-dialog';
import { useAppContext } from '@/context/app-context';


const Header = () => {
  const [isSaveOpen, setSaveOpen] = useState(false);
  const [isLoadOpen, setLoadOpen] = useState(false);
  const [isErrorLogOpen, setErrorLogOpen] = useState(false);
  const { errors } = useAppContext();

  return (
    <>
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">
              Iliad Social Spark
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setSaveOpen(true)}>
              <Save className="mr-2 h-4 w-4" />
              Save Journey
            </Button>
            <Button variant="outline" onClick={() => setLoadOpen(true)}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Load Journey
            </Button>
             <Button variant="outline" size="icon" className="relative" onClick={() => setErrorLogOpen(true)}>
              <Settings className="h-4 w-4" />
              {errors.length > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span></span> }
               <span className="sr-only">View Error Log</span>
            </Button>
          </div>
        </div>
      </header>
      <SaveJourneyDialog 
        isOpen={isSaveOpen} 
        setIsOpen={setSaveOpen}
      />
       <LoadJourneyDialog
        isOpen={isLoadOpen}
        setIsOpen={setLoadOpen}
      />
      <ErrorLogDialog
        isOpen={isErrorLogOpen}
        setIsOpen={setErrorLogOpen}
      />
    </>
  );
};

export default Header;
