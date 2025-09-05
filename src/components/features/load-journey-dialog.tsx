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
import { useToast } from '@/hooks/use-toast';
import { getJourneys, loadJourney } from '@/app/actions';
import type { Journey } from '@/app/page';
import type { SharedState } from '@/app/state';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface JourneyListItem {
  id: string;
  name: string;
  savedAt: string;
}

interface LoadJourneyDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLoad: (journey: Journey, data: SharedState) => void;
}

export default function LoadJourneyDialog({ isOpen, setIsOpen, onLoad }: LoadJourneyDialogProps) {
  const [journeys, setJourneys] = useState<JourneyListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getJourneys().then(({ data, error }) => {
        if (error) {
          toast({ title: 'Error fetching journeys', description: error, variant: 'destructive' });
        } else if(data) {
          setJourneys(data);
        }
        setIsLoading(false);
      });
    }
  }, [isOpen, toast]);

  const handleLoad = async () => {
    if (!selectedJourneyId) return;
    setIsLoading(true);
    const { data, error } = await loadJourney(selectedJourneyId);
    if (error) {
        toast({ title: 'Error loading journey', description: error, variant: 'destructive' });
    } else if (data) {
        const selectedJourney = journeys.find(j => j.id === selectedJourneyId);
        if (selectedJourney) {
            onLoad({ id: selectedJourney.id, name: selectedJourney.name }, data);
            toast({ title: 'Journey Loaded', description: `Successfully loaded "${selectedJourney.name}".` });
            setIsOpen(false);
        }
    }
    setIsLoading(false);
    setSelectedJourneyId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load Client Journey</DialogTitle>
          <DialogDescription>Select a previously saved journey to continue your work.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          {isLoading && !journeys.length ? (
            <div className='flex justify-center items-center h-24'>
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : journeys.length > 0 ? (
            journeys.map((journey) => (
              <button
                key={journey.id}
                onClick={() => setSelectedJourneyId(journey.id)}
                className={`text-left p-3 rounded-md border ${selectedJourneyId === journey.id ? 'border-primary ring-2 ring-primary' : 'hover:bg-accent'}`}
              >
                <p className="font-semibold">{journey.name}</p>
                <p className="text-sm text-muted-foreground">
                  Last saved: {format(new Date(journey.savedAt), "PPP p")}
                </p>
              </button>
            ))
          ) : (
            <p className='text-center text-muted-foreground py-8'>No saved journeys found.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleLoad} disabled={!selectedJourneyId || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load Journey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}