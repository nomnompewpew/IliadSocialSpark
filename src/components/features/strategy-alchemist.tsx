'use client';

import { useState, useTransition, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2, Clock, Hash, TrendingUp } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { runStrategyAlchemist } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import type { SharedState } from '@/app/page';

const formSchema = z.object({
  brandName: z.string().min(2, { message: 'Brand name is required.' }),
  industry: z.string().min(2, { message: 'Industry/Field is required.' }),
  brandDescription: z.string().min(10, { message: 'Brand description must be at least 10 characters.' }),
  targetAudience: z.string().min(10, { message: 'Target audience must be at least 10 characters.' }),
  goals: z.string().min(5, { message: 'Goals are required.' }),
});

interface StrategyAlchemistProps {
  sharedState: SharedState;
  onUpdate: (newState: Partial<SharedState>) => void;
}

const PlatformStrategyDisplay = ({ title, strategy, tactics }: { title: string, strategy?: string, tactics?: { postingTimes: string, hashtagStrategy: string, growthHacks: string } }) => {
  if (!strategy || !tactics) return null;

  return (
    <AccordionItem value={title.toLowerCase()}>
      <AccordionTrigger className='font-headline text-lg'>{title}</AccordionTrigger>
      <AccordionContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
        <div>
          <h4 className="font-semibold text-base mb-2">Strategy</h4>
          <p className='whitespace-pre-wrap'>{strategy}</p>
        </div>
        <Separator />
        <div>
          <h4 className="font-semibold text-base mb-3">Tactics</h4>
          <div className="space-y-3">
            <div className='flex items-start gap-3'>
              <Clock className='h-5 w-5 mt-1 text-primary flex-shrink-0' />
              <div>
                <h5 className='font-semibold'>Posting Times</h5>
                <p className='whitespace-pre-wrap'>{tactics.postingTimes}</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <Hash className='h-5 w-5 mt-1 text-primary flex-shrink-0' />
              <div>
                <h5 className='font-semibold'>Hashtag Strategy</h5>
                <p className='whitespace-pre-wrap'>{tactics.hashtagStrategy}</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <TrendingUp className='h-5 w-5 mt-1 text-primary flex-shrink-0' />
              <div>
                <h5 className='font-semibold'>Growth Hacks</h5>
                <p className='whitespace-pre-wrap'>{tactics.growthHacks}</p>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}


export default function StrategyAlchemist({ sharedState, onUpdate }: StrategyAlchemistProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: '',
      industry: sharedState.industry || '',
      brandDescription: sharedState.brandDetails || '',
      targetAudience: sharedState.targetDemographic || '',
      goals: '',
    },
  });

  useEffect(() => {
    form.setValue('brandDescription', sharedState.brandDetails);
    form.setValue('targetAudience', sharedState.targetDemographic);
    form.setValue('industry', sharedState.industry);
  }, [sharedState.brandDetails, sharedState.targetDemographic, sharedState.industry, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate({ strategy: null, industry: values.industry });
    startTransition(async () => {
      const { data, error } = await runStrategyAlchemist(values);
      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
        return;
      }
      onUpdate({ strategy: data });
    });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Strategy Alchemist</CardTitle>
          <p className="text-muted-foreground">Craft a winning social media strategy.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className='grid grid-cols-2 gap-4'>
              <FormField control={form.control} name="brandName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Iliad" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="industry" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry / Field</FormLabel>
                    <FormControl><Input placeholder="e.g., Fashion, Tech" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="brandDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe your brand's mission and values." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="targetAudience" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl><Textarea placeholder="Who are you trying to reach?" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="goals" render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Goals</FormLabel>
                  <FormControl><Input placeholder="e.g., Increase brand awareness, drive traffic" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Develop Strategy
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Platform Strategies & Tactics</CardTitle>
          <p className="text-muted-foreground">Your tailored strategies for each platform.</p>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {sharedState.strategy && (
            <Accordion type="multiple" defaultValue={['instagram']} className="w-full">
              <PlatformStrategyDisplay title="Instagram" strategy={sharedState.strategy.instagram.strategy} tactics={sharedState.strategy.instagram.tactics} />
              <PlatformStrategyDisplay title="Facebook" strategy={sharedState.strategy.facebook.strategy} tactics={sharedState.strategy.facebook.tactics} />
              <PlatformStrategyDisplay title="TikTok" strategy={sharedState.strategy.tiktok.strategy} tactics={sharedState.strategy.tiktok.tactics} />
              <PlatformStrategyDisplay title="LinkedIn" strategy={sharedState.strategy.linkedin.strategy} tactics={sharedState.strategy.linkedin.tactics} />
              <PlatformStrategyDisplay title="X (Twitter)" strategy={sharedState.strategy.x.strategy} tactics={sharedState.strategy.x.tactics} />
            </Accordion>
          )}
          {!isPending && !sharedState.strategy && (
            <div className="text-center text-muted-foreground py-8">
              Your comprehensive strategy awaits.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
