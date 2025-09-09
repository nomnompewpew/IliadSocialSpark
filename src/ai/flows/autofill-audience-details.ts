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
            // Using a common browser user agent can help bypass simple bot detectors
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
          }
        });
        if (!response.ok) {
           // Provide a more specific error message based on common failure reasons.
           throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}. The website may be blocking automated requests or require a login. Try using a PDF of the content instead.`);
        }
        const html = await response.text();
        const root = parse(html);
        
        // Remove script and style tags to clean up the content
        root.querySelectorAll('script, style').forEach(el => el.remove());

        // Try to find the main content, but fall back to the body
        const mainContent = root.querySelector('main')?.text || root.querySelector('article')?.text;
        const bodyText = root.querySelector('body')?.text;
        
        let textToParse = mainContent || bodyText;

        if (!textToParse || textToParse.trim().length < 100) { // Check for minimum content length
            throw new Error('Could not find enough readable text on the provided website. The site may heavily rely on JavaScript for rendering. Please try a different URL or use a PDF.');
        }

        // Clean up the text by removing excessive whitespace and newlines
        contentForPrompt = textToParse.replace(/\s\s+/g, ' ').trim();

      } catch (e: any) {
        console.error(`Error processing URL: ${e.message}`);
        // Re-throw the original, more specific error message
        throw new Error(e.message);
      }
    } else { // 'pdf'
      contentForPrompt = `{{media url="${input.source.data}"}}`;
    }

    const {output} = await prompt({ source: { data: contentForPrompt } });
    return output!;
  }
);
