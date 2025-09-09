'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ClipboardCopy } from './clipboard-copy';
import { format } from 'date-fns';
import { useAppContext } from '@/context/app-context';

interface ErrorLogDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ErrorLogDialog({ isOpen, setIsOpen }: ErrorLogDialogProps) {
  const { errors, clearErrors } = useAppContext();
  
  const handleClear = () => {
    clearErrors();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Error Log</DialogTitle>
          <DialogDescription>A list of errors that have occurred in this session.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-96 w-full rounded-md border p-4">
            {errors.length > 0 ? (
                errors.slice().reverse().map((error, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-start gap-4">
                           <div className="flex-grow">
                             <p className="text-sm text-muted-foreground">
                               {format(new Date(error.timestamp), "PPP p")}
                             </p>
                             <pre className="mt-2 w-full whitespace-pre-wrap text-sm font-code">
                               {error.message}
                             </pre>
                           </div>
                           <ClipboardCopy textToCopy={error.message} />
                        </div>
                        {index < errors.length - 1 && <Separator className="my-4" />}
                    </div>
                ))
            ) : (
                <p className="text-center text-muted-foreground py-16">No errors have been logged in this session.</p>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
           <Button variant="destructive" onClick={handleClear} disabled={errors.length === 0}>Clear Log</Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
