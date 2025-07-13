'use server';

/**
 * @fileOverview A flow for generating viral hook ideas based on niche and audience psychology.
 *
 * - generateViralHooks - A function that generates viral hook ideas.
 * - GenerateViralHooksInput - The input type for the generateViralHooks function.
 * - GenerateViralHooksOutput - The return type for the generateViralHooks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateViralHooksInputSchema = z.object({
  niche: z.string().describe('The specific niche or industry of the user.'),
  audiencePsychology: z
    .string()
    .describe('Description of the target audience and their psychological traits.'),
});
export type GenerateViralHooksInput = z.infer<typeof GenerateViralHooksInputSchema>;

const GenerateViralHooksOutputSchema = z.object({
  viralHooks: z.array(z.string()).describe('Array of viral hook ideas.'),
});
export type GenerateViralHooksOutput = z.infer<typeof GenerateViralHooksOutputSchema>;

export async function generateViralHooks(
  input: GenerateViralHooksInput
): Promise<GenerateViralHooksOutput> {
  return generateViralHooksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateViralHooksPrompt',
  input: {schema: GenerateViralHooksInputSchema},
  output: {schema: GenerateViralHooksOutputSchema},
  prompt: `You are a viral marketing expert. Generate several viral hook ideas based on the following niche and audience psychology.

Niche: {{{niche}}}
Audience Psychology: {{{audiencePsychology}}}

Provide a numbered list of at least 5 viral hook ideas that are likely to capture attention and drive engagement in the specified niche, considering the audience's psychological traits. Each idea should be concise and actionable.

Viral Hook Ideas:
`,
});

const generateViralHooksFlow = ai.defineFlow(
  {
    name: 'generateViralHooksFlow',
    inputSchema: GenerateViralHooksInputSchema,
    outputSchema: GenerateViralHooksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
