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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import { ClipboardCopy } from './clipboard-copy';
import { useAppContext } from '@/context/app-context';
import { TranslateButton } from './translate-button';

const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'X', 'Facebook'] as const;
const formats = ['Carousel', 'Video', 'Story', 'Reel', 'Post'] as const;

const formSchema = z.object({
  brandDescription: z.string().min(10, { message: 'Brand description must be at least 10 characters.' }),
  platform: z.enum(platforms),
  contentFormat: z.enum(formats),
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters.' }),
  keywords: z.string().min(3, { message: 'Please provide at least one keyword.' }),
});

export default function ContentCrafter() {
  const [isPending, startTransition] = useTransition();
  const { 
    brandDetails, 
    industry,
    strategy,
    captions,
    generateContentCaptions,
    updateState
  } = useAppContext();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandDescription: brandDetails || '',
      platform: 'Instagram',
      contentFormat: 'Post',
      topic: '',
      keywords: '',
    },
  });

  useEffect(() => {
    form.setValue('brandDescription', brandDetails);
  }, [brandDetails, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateState({ captions: null });
    
    const platformKey = values.platform.toLowerCase().replace(/\s\(.*\)/, '') as keyof typeof strategy;
    const strategyForPlatform = strategy ? strategy[platformKey] : undefined;

    const strategyPayload = strategyForPlatform ? {
      platformStrategy: strategyForPlatform.strategy,
      tactics: strategyForPlatform.tactics
    } : undefined;

    startTransition(async () => {
      await generateContentCaptions({ 
        ...values, 
        numberOfCaptions: 3,
        strategy: strategyPayload,
      });
    });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Content Crafter AI</CardTitle>
          <p className="text-muted-foreground">Generate high-performing captions & scripts.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="brandDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Description</FormLabel>
                  <FormControl><Textarea placeholder="Your brand's voice, mission, and values" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="platform" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger></FormControl>
                      <SelectContent>{platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="contentFormat" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger></FormControl>
                      <SelectContent>{formats.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="topic" render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl><Input placeholder={industry ? `A post about the ${industry} industry` : "What is the content about?"} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="keywords" render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl><Input placeholder="e.g., social media, marketing, AI" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Craft Content
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Generated Captions / Scripts</CardTitle>
          <p className="text-muted-foreground">AI-generated content ready for you to use.</p>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-6">
              <div className='space-y-2'><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div>
              <Separator />
              <div className='space-y-2'><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div>
              <Separator />
              <div className='space-y-2'><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div>
            </div>
          )}
          {captions && (
            <div className="space-y-6">
              {captions.captions.map((caption, index) => (
                <div key={index}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap flex-grow">{caption}</div>
                      <div className="flex items-center">
                        <TranslateButton textToTranslate={caption} />
                        <ClipboardCopy textToCopy={caption} />
                      </div>
                    </div>
                    {index < captions.captions.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
          {!isPending && !captions && (
            <div className="text-center text-muted-foreground py-8">
              Your next viral post starts here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
