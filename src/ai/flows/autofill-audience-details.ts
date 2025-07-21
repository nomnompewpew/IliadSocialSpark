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
  AutofillAudienceDetailsContentInputSchema,
  AutofillAudienceDetailsContentInput
} from '@/ai/schemas/autofill-schemas';
import { parse } from 'node-html-parser';

export type { AutofillAudienceDetailsInput, AutofillAudienceDetailsOutput };

export async function autofillAudienceDetails(input: AutofillAudienceDetailsInput): Promise<AutofillAudienceDetailsOutput> {
  return autofillAudienceDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autofillAudiencePrompt',
  input: {schema: AutofillAudienceDetailsContentInputSchema},
  output: {schema: AutofillAudienceDetailsOutputSchema},
  prompt: `You are an expert marketing analyst. Analyze the provided content and extract the brand details and target audience information.

  Content to analyze:
  {{#if (eq source.type "pdf")}}
  {{media url=source.data}}
  {{/if}}
  {{#if (eq source.type "text")}}
  {{{source.data}}}
  {{/if}}

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
    let contentInput: AutofillAudienceDetailsContentInput;

    if (input.source.type === 'url') {
      try {
        const response = await fetch(input.source.data);
        if (!response.ok) {
          throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        const html = await response.text();
        const root = parse(html);
        const bodyText = root.querySelector('body')?.innerText ?? '';
        contentInput = { source: { type: 'text', data: bodyText.replace(/\s\s+/g, ' ').trim() } };
      } catch (e: any) {
        console.error(`Error fetching or parsing URL: ${e.message}`);
        throw new Error('Could not retrieve content from the provided URL.');
      }
    } else {
      contentInput = input;
    }

    const {output} = await prompt(contentInput);
    return output!;
  }
);
