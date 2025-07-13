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
import type { CreateSocialMediaStrategyOutput } from '@/ai/flows/create-social-media-strategy';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  brandName: z.string().min(2, { message: 'Brand name is required.' }),
  brandDescription: z.string().min(10, { message: 'Brand description must be at least 10 characters.' }),
  targetAudience: z.string().min(10, { message: 'Target audience must be at least 10 characters.' }),
  goals: z.string().min(5, { message: 'Goals are required.' }),
});

export default function StrategyAlchemist() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CreateSocialMediaStrategyOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: '',
      brandDescription: '',
      targetAudience: '',
      goals: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
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
      setResult(data);
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
              <FormField control={form.control} name="brandName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Iliad" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
          <CardTitle className="font-headline">Platform Strategies</CardTitle>
          <p className="text-muted-foreground">Your tailored strategies for each platform.</p>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {result && (
            <Accordion type="multiple" defaultValue={['instagram']} className="w-full">
              <AccordionItem value="instagram">
                <AccordionTrigger className='font-headline'>Instagram Strategy</AccordionTrigger>
                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{result.instagramStrategy}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="tiktok">
                <AccordionTrigger className='font-headline'>TikTok Strategy</AccordionTrigger>
                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{result.tiktokStrategy}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="linkedin">
                <AccordionTrigger className='font-headline'>LinkedIn Strategy</AccordionTrigger>
                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{result.linkedinStrategy}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="x">
                <AccordionTrigger className='font-headline'>X (Twitter) Strategy</AccordionTrigger>
                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{result.xStrategy}</AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {!isPending && !result && (
            <div className="text-center text-muted-foreground py-8">
              Your comprehensive strategy awaits.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
