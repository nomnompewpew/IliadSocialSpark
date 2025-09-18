"use client";

import { useState } from 'react';
import { Sparkles, Save, FolderOpen, User, LogOut, Moon, Sun, Laptop, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import SaveJourneyDialog from '@/components/features/save-journey-dialog';
import LoadJourneyDialog from '@/components/features/load-journey-dialog';
import ErrorLogDialog from '@/components/features/error-log-dialog';
import { useAppContext } from '@/context/app-context';
import { useAuth } from '@/context/auth-context';
import { useTheme } from 'next-themes';


const Header = () => {
  const [isSaveOpen, setSaveOpen] = useState(false);
  const [isLoadOpen, setLoadOpen] = useState(false);
  const [isErrorLogOpen, setErrorLogOpen] = useState(false);
  const { errors } = useAppContext();
  const { signOutUser, user } = useAuth();
  const { setTheme } = useTheme();

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
            <Button variant="outline" size="icon" className="md:w-auto md:px-4" onClick={() => setSaveOpen(true)}>
              <Save className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Save Journey</span>
              <span className="sr-only">Save Journey</span>
            </Button>
            <Button variant="outline" size="icon" className="md:w-auto md:px-4" onClick={() => setLoadOpen(true)}>
              <FolderOpen className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Load Journey</span>
              <span className="sr-only">Load Journey</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                   <span className="sr-only">User Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme('light')}><Sun className="mr-2 h-4 w-4" />Light</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}><Moon className="mr-2 h-4 w-4" />Dark</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}><Laptop className="mr-2 h-4 w-4" />System</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={() => setErrorLogOpen(true)}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <span>Error Log</span>
                   {errors.length > 0 && <span className="ml-auto flex h-2 w-2 translate-x-1 items-center justify-center rounded-full bg-destructive" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOutUser}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
