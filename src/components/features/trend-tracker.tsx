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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runTrendTracker } from '@/app/actions';
import type { IdentifyTrendingTopicsOutput } from '@/ai/flows/identify-trending-topics';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'X', 'Facebook'] as const;

const formSchema = z.object({
  niche: z.string().min(3, { message: 'Niche must be at least 3 characters.' }),
  platforms: z.array(z.enum(platforms)).refine((value) => value.some((item) => item), {
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
          <CardTitle className="font-headline">Trending Topics</CardTitle>
          <p className="text-muted-foreground">Actionable insights into what's popular now.</p>
        </CardHeader>
        <CardContent>
          {isPending && (
             <div className="space-y-6">
                <div>
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-7 w-32" />
                        <Skeleton className="h-7 w-28" />
                    </div>
                </div>
                 <div>
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-7 w-28" />
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-7 w-32" />
                    </div>
                </div>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              {Object.entries(result.trendingTopics).map(([platform, topics]) => (
                <div key={platform}>
                  <h3 className="font-headline text-lg mb-2">{platform}</h3>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-base px-3 py-1">{topic}</Badge>
                    ))}
                  </div>
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
