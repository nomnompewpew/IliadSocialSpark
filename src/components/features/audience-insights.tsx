'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2, Trash2 } from 'lucide-react';
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
import { runAudienceInsights, runAutofillAudienceDetails } from '@/app/actions';
import type { AudienceInsightsOutput } from '@/ai/flows/generate-audience-insights';
import { Skeleton } from '../ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const formSchema = z.object({
  brandDetails: z.string().min(10, {
    message: 'Brand details must be at least 10 characters.',
  }).max(2000, { message: 'Brand details must be at most 2000 characters.' }),
  targetDemographic: z.string().min(10, {
    message: 'Target demographic must be at least 10 characters.',
  }).max(2000, { message: 'Target demographic must be at most 2000 characters.' }),
});

export default function AudienceInsights() {
  const [isPending, startTransition] = useTransition();
  const [isAutofilling, startAutofillTransition] = useTransition();
  const [result, setResult] = useState<AudienceInsightsOutput | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandDetails: '',
      targetDemographic: '',
    },
  });

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setWebsiteUrl('');
    } else {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
    }
  };

  const handleAutofill = () => {
    let input: any;
    if (pdfFile) {
      const reader = new FileReader();
      reader.readAsDataURL(pdfFile);
      reader.onload = () => {
        const dataUri = reader.result as string;
        input = { source: { type: 'pdf', data: dataUri } };
        triggerAutofill(input);
      };
      reader.onerror = (error) => {
        toast({ title: 'Error reading file', description: error.toString(), variant: 'destructive' });
      };
    } else if (websiteUrl) {
      if (!websiteUrl.startsWith('http')) {
        toast({ title: 'Invalid URL', description: 'Please enter a valid URL (e.g., https://example.com)', variant: 'destructive' });
        return;
      }
      input = { source: { type: 'url', data: websiteUrl } };
      triggerAutofill(input);
    } else {
      toast({ title: 'No source selected', description: 'Please upload a PDF or enter a website URL.', variant: 'default' });
    }
  };

  const triggerAutofill = (input: any) => {
    startAutofillTransition(async () => {
      const { data, error } = await runAutofillAudienceDetails(input);
      if (error) {
        toast({ title: 'Autofill Failed', description: error, variant: 'destructive' });
        return;
      }
      if (data) {
        form.setValue('brandDetails', data.brandDetails, { shouldValidate: true });
        form.setValue('targetDemographic', data.targetDemographic, { shouldValidate: true });
        toast({ title: 'Autofill Successful', description: 'The fields have been populated.' });
      }
    });
  }

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
          <Accordion type="single" collapsible className="w-full mb-6">
            <AccordionItem value="item-1">
              <AccordionTrigger className='font-headline'>Autofill with PDF or Website</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="pdf-upload">Upload PDF</Label>
                  <div className="flex items-center gap-2">
                    <Input id="pdf-upload" type="file" accept="application/pdf" onChange={handlePdfUpload} className="flex-grow" disabled={!!websiteUrl}/>
                  </div>
                  {pdfFile && <p className="text-sm text-muted-foreground flex items-center gap-2">Selected: {pdfFile.name} <Button variant="ghost" size="icon" className='h-6 w-6' onClick={() => setPdfFile(null)}><Trash2 className='h-4 w-4 text-destructive'/></Button></p>}
                </div>
                <div className="text-center text-muted-foreground text-sm">OR</div>
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input id="website-url" type="url" placeholder="https://example.com" value={websiteUrl} onChange={(e) => { setWebsiteUrl(e.target.value); setPdfFile(null); }} disabled={!!pdfFile}/>
                </div>
                <Button onClick={handleAutofill} disabled={isAutofilling || (!pdfFile && !websiteUrl)} className="w-full">
                  {isAutofilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Autofill Fields
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
