'use client';

import { useState, useTransition } from 'react';
import { Languages, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/context/app-context';
import { ClipboardCopy } from './clipboard-copy';

interface TranslateButtonProps {
  textToTranslate: string;
}

export function TranslateButton({ textToTranslate }: TranslateButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const { translateText: runTranslation } = useAppContext();

  const handleTranslate = () => {
    if (translatedText) return; // Don't re-translate

    startTransition(async () => {
      const result = await runTranslation({
        textToTranslate,
        targetLanguage: 'Spanish for a Mexican audience',
      });
      if (result) {
        setTranslatedText(result.translatedText);
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleTranslate}
          className="h-8 w-8 flex-shrink-0"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Translate</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Spanish Translation</h4>
            <p className="text-sm text-muted-foreground">
              Translation for a Mexican audience.
            </p>
          </div>
          <ScrollArea className="h-60 w-full rounded-md border p-4">
            {isPending && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {translatedText && (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {translatedText}
              </div>
            )}
          </ScrollArea>
           {translatedText && (
              <div className='flex items-center justify-end'>
                  <ClipboardCopy textToCopy={translatedText} />
              </div>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
