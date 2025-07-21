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
        const response = await fetch(input.source.data);
        if (!response.ok) {
          throw new Error(`Failed to fetch URL with status: ${response.status}`);
        }
        const html = await response.text();
        const root = parse(html);
        const bodyText = root.querySelector('body')?.text;
        if (!bodyText) {
            throw new Error('Could not find any text content on the provided website.');
        }
        contentForPrompt = bodyText.replace(/\s\s+/g, ' ').trim();
      } catch (e: any) {
        console.error(`Error processing URL: ${e.message}`);
        throw new Error('Could not retrieve or process content from the provided URL. The website might be blocking requests or has no readable content.');
      }
    } else { // 'pdf'
      contentForPrompt = `{{media url="${input.source.data}"}}`;
    }

    const {output} = await prompt({ source: { data: contentForPrompt } });
    return output!;
  }
);
