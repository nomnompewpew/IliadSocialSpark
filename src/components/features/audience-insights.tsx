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
import { runAudienceInsights } from '@/app/actions';
import type { AudienceInsightsOutput } from '@/ai/flows/generate-audience-insights';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  brandDetails: z.string().min(10, {
    message: 'Brand details must be at least 10 characters.',
  }).max(500, { message: 'Brand details must be at most 500 characters.' }),
  targetDemographic: z.string().min(10, {
    message: 'Target demographic must be at least 10 characters.',
  }).max(500, { message: 'Target demographic must be at most 500 characters.' }),
});

export default function AudienceInsights() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AudienceInsightsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandDetails: '',
      targetDemographic: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      const { data, error } = await runAudienceInsights(values);
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
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Audience Insights Generator</CardTitle>
          <p className="text-muted-foreground">Describe your brand and target audience to generate a detailed analysis.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="brandDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A sustainable fashion brand focusing on minimalist designs and ethical sourcing."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information about your brand, its values, and mission.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetDemographic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Demographic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Eco-conscious millennials aged 25-35, living in urban areas, interested in sustainable living and design."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your ideal customer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Insights
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Audience Analysis Report</CardTitle>
          <p className="text-muted-foreground">The generated insights about your audience will appear here.</p>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <br />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}
          {result && (
             <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {result.audienceAnalysisReport}
            </div>
          )}
          {!isPending && !result && (
            <div className="text-center text-muted-foreground py-8">
              Your report is waiting to be generated.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
