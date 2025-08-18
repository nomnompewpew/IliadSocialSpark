'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2, Lightbulb, Bot } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { runTrendTracker } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import type { SharedState } from '@/app/page';

const formSchema = z.object({
  industry: z.string().min(2, { message: 'Industry/Field is required.' }),
  products: z.string().optional(),
  services: z.string().optional(),
  buyingHabits: z.string().optional(),
  entertainment: z.string().optional(),
});

interface TrendTrackerProps {
  sharedState: SharedState;
  onUpdate: (newState: Partial<SharedState>) => void;
}

const PlatformTrendsDisplay = ({ title, trends, isLoading }: { title: string; trends?: { topic: string; description: string; contentIdea: string; }[]; isLoading?: boolean; }) => {
    if (isLoading) {
        return <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    }
  if (!trends || trends.length === 0) return null;

  return (
    <AccordionItem value={title.toLowerCase()}>
      <AccordionTrigger className='font-headline text-lg capitalize'>{title}</AccordionTrigger>
      <AccordionContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        {trends.map((trend, index) => (
            <div key={index} className="space-y-2">
                <h4 className="font-semibold text-base mb-1 flex items-center gap-2">
                    <Lightbulb className='h-5 w-5 text-primary flex-shrink-0' />
                    {trend.topic}
                </h4>
                <p className='whitespace-pre-wrap'>{trend.description}</p>
                 <div className='flex items-start gap-3 rounded-md bg-muted/50 p-3'>
                    <Bot className='h-5 w-5 mt-1 text-primary flex-shrink-0' />
                    <div>
                        <h5 className='font-semibold'>Content Idea</h5>
                        <p className='whitespace-pre-wrap'>{trend.contentIdea}</p>
                    </div>
                </div>
                {index < trends.length - 1 && <Separator className="my-4" />}
            </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export default function TrendTracker({ sharedState, onUpdate }: TrendTrackerProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: '',
      products: '',
      services: '',
      buyingHabits: '',
      entertainment: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate({ trends: null });
    startTransition(async () => {
      const { data, error } = await runTrendTracker(values);
      if (error) {
        toast({ title: 'Error', description: error, variant: 'destructive' });
        return;
      }
      onUpdate({ trends: data });
    });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Trend Tracker</CardTitle>
          <p className="text-muted-foreground">Discover what's buzzing in your niche.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="industry" render={({ field }) => (
                <FormItem>
                  <FormLabel>Field / Industry</FormLabel>
                  <FormControl><Input placeholder="e.g., Fashion, Tech, Health" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
               <FormField control={form.control} name="products" render={({ field }) => (
                <FormItem>
                  <FormLabel>Products (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="e.g., smartphones, laptops" {...field} className='h-20' /></FormControl>
                  <FormDescription>Comma-separated relevant products.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
               <FormField control={form.control} name="services" render={({ field }) => (
                <FormItem>
                  <FormLabel>Services (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="e.g., streaming subscriptions, delivery apps" {...field} className='h-20' /></FormControl>
                   <FormDescription>Comma-separated relevant services.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
               <FormField control={form.control} name="buyingHabits" render={({ field }) => (
                <FormItem>
                  <FormLabel>Buying Habits (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="e.g., impulse purchases, eco-friendly choices" {...field} className='h-20' /></FormControl>
                  <FormDescription>Audience purchasing behaviors.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
                <FormField control={form.control} name="entertainment" render={({ field }) => (
                <FormItem>
                  <FormLabel>Entertainment (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="e.g., viral challenges, celebrity endorsements" {...field} className='h-20' /></FormControl>
                  <FormDescription>Related entertainment or cultural elements.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isPending} className="w-full !mt-6">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Trends
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Trending Topics by Platform</CardTitle>
          <p className="text-muted-foreground">The latest trends, generated just for you.</p>
        </CardHeader>
        <CardContent>
          {(isPending || sharedState.trends) ? (
            <Accordion type="multiple" defaultValue={['x']} className="w-full">
                <PlatformTrendsDisplay title="X (Twitter)" trends={sharedState.trends?.x} isLoading={isPending} />
                <PlatformTrendsDisplay title="Facebook" trends={sharedState.trends?.facebook} isLoading={isPending} />
                <PlatformTrendsDisplay title="Instagram" trends={sharedState.trends?.instagram} isLoading={isPending} />
                <PlatformTrendsDisplay title="LinkedIn" trends={sharedState.trends?.linkedin} isLoading={isPending} />
                <PlatformTrendsDisplay title="TikTok" trends={sharedState.trends?.tiktok} isLoading={isPending} />
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Your trends report is waiting to be generated.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
