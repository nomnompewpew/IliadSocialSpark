'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runTrendTracker } from '@/app/actions';
import type { IdentifyTrendingTopicsOutput } from '@/ai/flows/identify-trending-topics';
import { Skeleton } from '../ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'X', 'Facebook'] as const;

const formSchema = z.object({
  niche: z.string().min(3, { message: 'Niche must be at least 3 characters.' }),
  platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one platform.',
  }),
});

export default function TrendTracker() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<IdentifyTrendingTopicsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      platforms: ['Instagram', 'TikTok'],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      const { data, error } = await runTrendTracker(values);
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
          <CardTitle className="font-headline">Trend Tracker</CardTitle>
          <p className="text-muted-foreground">Discover what's buzzing in your niche.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="niche" render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Niche/Industry</FormLabel>
                  <FormControl><Input placeholder="e.g., Artificial Intelligence, Health & Wellness" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="platforms" render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Platforms</FormLabel>
                    <FormDescription>Select the platforms to track.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {platforms.map((platform) => (
                      <FormField key={platform} control={form.control} name="platforms" render={({ field }) => (
                        <FormItem key={platform} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(platform)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, platform])
                                  : field.onChange(field.value?.filter((value) => value !== platform));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{platform}</FormLabel>
                        </FormItem>
                      )} />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Find Trends
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Trending Topics & Ideas</CardTitle>
          <p className="text-muted-foreground">Actionable insights into what's popular now.</p>
        </CardHeader>
        <CardContent>
          {isPending && (
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          )}
          {result && (
            <div className="space-y-4">
              {Object.entries(result.trendingTopics).map(([platform, topics]) => (
                <div key={platform}>
                  <h3 className="font-headline text-xl mb-3">{platform}</h3>
                    <Accordion type="multiple" className="w-full space-y-2">
                        {topics.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index} className="bg-secondary/50 px-4 rounded-md border-b-0">
                                <AccordionTrigger className="py-3 font-semibold hover:no-underline">{item.topic}</AccordionTrigger>
                                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none space-y-3 pb-4">
                                    <p>{item.explanation}</p>
                                    <div className="flex items-start gap-3 rounded-md bg-background/50 p-3">
                                        <Lightbulb className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                        <div>
                                            <h5 className='font-semibold'>Content Idea</h5>
                                            <p className='whitespace-pre-wrap'>{item.contentIdea}</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
              ))}
            </div>
          )}
          {!isPending && !result && (
            <div className="text-center text-muted-foreground py-8">
              The latest trends are just a click away.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
