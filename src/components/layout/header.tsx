"use client";

import { useState } from 'react';
import { Sparkles, Save, FolderOpen, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SaveJourneyDialog from '@/components/features/save-journey-dialog';
import LoadJourneyDialog from '@/components/features/load-journey-dialog';
import ErrorLogDialog from '@/components/features/error-log-dialog';
import { useAppContext } from '@/context/app-context';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Header = () => {
  const [isSaveOpen, setSaveOpen] = useState(false);
  const [isLoadOpen, setLoadOpen] = useState(false);
  const [isErrorLogOpen, setErrorLogOpen] = useState(false);
  const { errors } = useAppContext();
  const { user, logout } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }

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
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
