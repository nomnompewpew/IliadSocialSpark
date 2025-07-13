'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runViralHookGenerator } from '@/app/actions';
import type { GenerateViralHooksOutput } from '@/ai/flows/generate-viral-hooks';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  niche: z.string().min(3, { message: 'Niche must be at least 3 characters.' }),
  audiencePsychology: z.string().min(10, { message: 'Audience psychology must be at least 10 characters.' }),
});

export default function ViralHookGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateViralHooksOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      audiencePsychology: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      const { data, error } = await runViralHookGenerator(values);
      if (error) {
        toast({ title: 'Error', description: error, variant: 'destructive' });
        return;
      }
      setResult(data);
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
                  <FormLabel>Your Niche</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Personal finance for freelancers" {...field} />
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
          {result && (
            <ul className="space-y-3 list-disc list-inside">
              {result.viralHooks.map((hook, index) => (
                <li key={index} className="bg-secondary/50 p-3 rounded-md">{hook}</li>
              ))}
            </ul>
          )}
          {!isPending && !result && (
            <div className="text-center text-muted-foreground py-8">
              Viral hooks are ready to be discovered.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
