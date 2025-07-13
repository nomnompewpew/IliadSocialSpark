'use server';

/**
 * @fileOverview A flow to identify trending topics relevant to a user's niche on various social media platforms.
 *
 * - identifyTrendingTopics - A function that handles the identification of trending topics.
 * - IdentifyTrendingTopicsInput - The input type for the identifyTrendingTopics function.
 * - IdentifyTrendingTopicsOutput - The return type for the identifyTrendingTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyTrendingTopicsInputSchema = z.object({
  niche: z.string().describe('The specific niche or industry to identify trending topics for.'),
  platforms: z
    .array(z.enum(['Instagram', 'TikTok', 'LinkedIn', 'X']))
    .describe('The social media platforms to search for trending topics on.'),
});
export type IdentifyTrendingTopicsInput = z.infer<typeof IdentifyTrendingTopicsInputSchema>;

const IdentifyTrendingTopicsOutputSchema = z.object({
  trendingTopics: z.record(z.string(), z.array(z.string())).describe(
    'A record of trending topics for each platform, where the key is the platform name and the value is an array of trending topics.'
  ),
});
export type IdentifyTrendingTopicsOutput = z.infer<typeof IdentifyTrendingTopicsOutputSchema>;

export async function identifyTrendingTopics(input: IdentifyTrendingTopicsInput): Promise<IdentifyTrendingTopicsOutput> {
  return identifyTrendingTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyTrendingTopicsPrompt',
  input: {schema: IdentifyTrendingTopicsInputSchema},
  output: {schema: IdentifyTrendingTopicsOutputSchema},
  prompt: `You are an expert social media analyst. Your job is to identify trending topics for a given niche on specified social media platforms.

  Niche: {{{niche}}}
  Platforms: {{#each platforms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Analyze the current trends and provide a list of trending topics for each platform that are relevant to the niche.
  Return the trending topics in JSON format.
  `,
});

const identifyTrendingTopicsFlow = ai.defineFlow(
  {
    name: 'identifyTrendingTopicsFlow',
    inputSchema: IdentifyTrendingTopicsInputSchema,
    outputSchema: IdentifyTrendingTopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
