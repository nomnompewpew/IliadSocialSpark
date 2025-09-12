'use client';

import { useTransition, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { ClipboardCopy } from './clipboard-copy';
import { useAppContext } from '@/context/app-context';
import { TranslateButton } from './translate-button';

const formSchema = z.object({
  niche: z.string().min(3, { message: 'Niche must be at least 3 characters.' }),
  audiencePsychology: z.string().min(10, { message: 'Audience psychology must be at least 10 characters.' }),
});

export default function ViralHookGenerator() {
  const [isPending, startTransition] = useTransition();
  const {
    industry,
    targetDemographic,
    audienceAnalysisReport,
    hooks,
    generateViralHooks,
    updateState,
  } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: industry || '',
      audiencePsychology: audienceAnalysisReport?.audienceAnalysisReport || targetDemographic || '',
    },
  });

  useEffect(() => {
    form.setValue('audiencePsychology', audienceAnalysisReport?.audienceAnalysisReport || targetDemographic);
    form.setValue('niche', industry);
  }, [targetDemographic, audienceAnalysisReport, industry, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateState({ hooks: null });
    startTransition(async () => {
      await generateViralHooks(values);
    });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Viral Hook Generator</CardTitle>
          <p className="text-muted-foreground">Generate hooks that capture attention instantly.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="niche" render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Niche / Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Personal finance for freelancers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="audiencePsychology" render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience Psychology</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., They fear financial instability but desire freedom. They are ambitious and look for actionable advice." className="h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Hooks
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generated Hook Ideas</CardTitle>
          <p className="text-muted-foreground">Use these to make your content go viral.</p>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/6" />
              <Skeleton className="h-5 w-full" />
            </div>
          )}
          {hooks && (
            <ul className="space-y-3">
              {hooks.viralHooks.map((hook, index) => (
                <li key={index} className="bg-secondary/50 p-3 rounded-md flex justify-between items-center gap-2">
                  <span className='flex-grow'>{hook}</span>
                  <div className="flex items-center flex-shrink-0">
                    <TranslateButton textToTranslate={hook} />
                    <ClipboardCopy textToCopy={hook} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!isPending && !hooks && (
            <div className="text-center text-muted-foreground py-8">
              Viral hooks are ready to be discovered.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
