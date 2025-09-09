'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/app-context';

interface SaveJourneyDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SaveJourneyDialog({ isOpen, setIsOpen }: SaveJourneyDialogProps) {
  const [clientName, setClientName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { currentJourney, saveCurrentJourney, saveAsNewJourney } = useAppContext();

  useEffect(() => {
    if (isOpen) {
      setClientName(currentJourney?.name || '');
    }
  }, [currentJourney, isOpen]);

  const handleSave = async () => {
    if (!clientName.trim()) {
      toast({ title: 'Client name is required', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const success = await saveCurrentJourney(clientName);
    if (success) {
      toast({ title: 'Journey Updated!', description: `"${clientName}" has been successfully updated.` });
      setIsOpen(false);
    }
    setIsSaving(false);
  };

  const handleSaveAsNew = async () => {
     if (!clientName.trim()) {
      toast({ title: 'Client name is required', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const success = await saveAsNewJourney(clientName);
    if (success) {
        toast({ title: 'Journey Saved as New!', description: `A new journey "${clientName}" has been created.` });
        setIsOpen(false);
    }
    setIsSaving(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Client Journey</DialogTitle>
          <DialogDescription>Save the current state to resume your work later.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Client Name
            </Label>
            <Input
              id="name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Nike - Fall 2024 Campaign"
            />
          </div>
        </div>
        <DialogFooter>
          {currentJourney ? (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Current
              </Button>
               <Button variant="secondary" onClick={handleSaveAsNew} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save as New
              </Button>
            </>
          ) : (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
