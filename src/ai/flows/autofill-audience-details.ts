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
  type AutofillAudienceDetailsOutput
} from '@/ai/schemas/autofill-schemas';

export type { AutofillAudienceDetailsInput, AutofillAudienceDetailsOutput };

export async function autofillAudienceDetails(input: AutofillAudienceDetailsInput): Promise<AutofillAudienceDetailsOutput> {
  return autofillAudienceDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autofillAudiencePrompt',
  input: {schema: AutofillAudienceDetailsInputSchema},
  output: {schema: AutofillAudienceDetailsOutputSchema},
  prompt: `You are an expert marketing analyst. Analyze the provided content and extract the brand details and target audience information.

  Content to analyze:
  {{#if (eq source.type "pdf")}}
  {{media url=source.data}}
  {{/if}}
  {{#if (eq source.type "url")}}
  The primary source of information is the website at this URL: {{{source.data}}}
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
    const {output} = await prompt(input);
    return output!;
  }
);
