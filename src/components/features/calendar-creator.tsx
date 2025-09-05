'use client';

import { useState, useTransition, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { runCalendarCreator } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '../ui/skeleton';
import type { SharedState } from '@/app/state';
import { ClipboardCopy } from './clipboard-copy';

const formSchema = z.object({
  brandDescription: z.string().min(10, { message: 'Brand description must be at least 10 characters.' }),
  targetAudience: z.string().min(10, { message: 'Target audience must be at least 10 characters.' }),
  goals: z.string().min(5, { message: 'Goals are required.' }),
});

interface CalendarCreatorProps {
  sharedState: SharedState;
  onUpdate: (newState: Partial<SharedState>) => void;
}

export default function CalendarCreator({ sharedState, onUpdate }: CalendarCreatorProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandDescription: sharedState.brandDetails || '',
      targetAudience: sharedState.targetDemographic || '',
      goals: '',
    },
  });

  useEffect(() => {
    form.setValue('brandDescription', sharedState.brandDetails);
    form.setValue('targetAudience', sharedState.targetDemographic);
  }, [sharedState.brandDetails, sharedState.targetDemographic, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate({ calendar: null });
    startTransition(async () => {
      const { data, error } = await runCalendarCreator(values);
      if (error) {
        toast({ title: 'Error', description: error, variant: 'destructive' });
        return;
      }
      onUpdate({ calendar: data });
    });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Calendar Creator</CardTitle>
          <p className="text-muted-foreground">Generate a 30-day content plan in seconds.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormControl><Textarea placeholder="e.g., Increase engagement by 20%, grow followers by 500." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Create Calendar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">30-Day Content Calendar</CardTitle>
          <p className="text-muted-foreground">Your strategic content plan is ready.</p>
        </CardHeader>
        <CardContent>
          {isPending && (
             <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
             </div>
          )}
          {sharedState.calendar && (
            <div className="max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader className='sticky top-0 bg-card'>
                  <TableRow>
                    <TableHead className="w-[50px]">Day</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Caption</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sharedState.calendar.calendar.map((entry) => (
                    <TableRow key={entry.day}>
                      <TableCell className="font-medium">{entry.day}</TableCell>
                      <TableCell>{entry.postType}</TableCell>
                      <TableCell>{entry.topic}</TableCell>
                      <TableCell className='whitespace-pre-wrap'>{entry.caption}</TableCell>
                      <TableCell className='text-right'>
                        <ClipboardCopy textToCopy={entry.caption} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isPending && !sharedState.calendar && (
            <div className="text-center text-muted-foreground py-8">
              Your content calendar is waiting to be planned.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}