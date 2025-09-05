'use server';

/**
 * @fileOverview A flow for autofilling audience details from a PDF or website URL.
 *
 * - autofillAudienceDetails - A function that extracts brand and audience details.
 * - AutofillAudienceDetailsInput - The input type for the function.
 * - AutofillAudienceDetailsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
  AutofillAudienceDetailsInputSchema,
  AutofillAudienceDetailsOutputSchema,
  type AutofillAudienceDetailsInput,
  type AutofillAudienceDetailsOutput,
} from '@/ai/schemas/autofill-schemas';
import {z} from 'genkit';
import { parse } from 'node-html-parser';

export type { AutofillAudienceDetailsInput, AutofillAudienceDetailsOutput };

export async function autofillAudienceDetails(input: AutofillAudienceDetailsInput): Promise<AutofillAudienceDetailsOutput> {
  return autofillAudienceDetailsFlow(input);
}

const PromptInputSchema = z.object({
  source: z.object({
    data: z.string().describe('The content to analyze, either as plain text from a website or a Handlebars media tag for a PDF.'),
  }),
});

const prompt = ai.definePrompt({
  name: 'autofillAudiencePrompt',
  input: {schema: PromptInputSchema},
  output: {schema: AutofillAudienceDetailsOutputSchema},
  prompt: `You are an expert marketing analyst. Analyze the provided content and extract the brand details and target audience information.

  Content to analyze:
  {{{source.data}}}

  Based on the content, provide a concise summary for:
  1.  **Brand Details**: What is the brand, what are its values, and what is its mission?
  2.  **Target Demographic**: Describe the ideal customer, including their age, location, interests, and pain points.
  `,
});


const autofillAudienceDetailsFlow = ai.defineFlow(
  {
    name: 'autofillAudienceDetailsFlow',
    inputSchema: AutofillAudienceDetailsInputSchema,
    outputSchema: AutofillAudienceDetailsOutputSchema,
  },
  async input => {
    let contentForPrompt: string;

    if (input.source.type === 'url') {
      try {
        const response = await fetch(input.source.data, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch URL. The server responded with status: ${response.status} ${response.statusText}. The website may be blocking automated requests.`);
        }
        const html = await response.text();
        const root = parse(html);
        
        // Try to find the main content, but fall back to the body
        const mainContent = root.querySelector('main')?.text || root.querySelector('article')?.text;
        const bodyText = root.querySelector('body')?.text;
        
        let textToParse = mainContent || bodyText;

        if (!textToParse || textToParse.trim().length === 0) {
            throw new Error('Could not find any readable text content on the provided website.');
        }

        // Clean up the text
        contentForPrompt = textToParse.replace(/\s\s+/g, ' ').trim();

      } catch (e: any) {
        console.error(`Error processing URL: ${e.message}`);
        // Pass a more specific error message to the user
        throw new Error(e.message || 'An unknown error occurred while processing the URL. The website might be offline or blocking requests.');
      }
    } else { // 'pdf'
      contentForPrompt = `{{media url="${input.source.data}"}}`;
    }

    const {output} = await prompt({ source: { data: contentForPrompt } });
    return output!;
  }
);
