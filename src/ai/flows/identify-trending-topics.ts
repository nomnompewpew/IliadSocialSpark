'use server';

/**
 * @fileOverview A flow for identifying trending topics based on user's industry and interests.
 *
 * - identifyTrendingTopics - A function that generates trending topics for various social platforms.
 * - IdentifyTrendingTopicsInput - The input type for the function.
 * - IdentifyTrendingTopicsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyTrendingTopicsInputSchema = z.object({
  industry: z.string().describe('The field or industry to search for trends in.'),
  products: z.string().optional().describe('Example products related to the industry.'),
  services: z.string().optional().describe('Example services related to the industry.'),
  buyingHabits: z.string().optional().describe('Common buying habits of the target audience.'),
  entertainment: z.string().optional().describe('Related entertainment options or celebrity endorsements.'),
});
export type IdentifyTrendingTopicsInput = z.infer<typeof IdentifyTrendingTopicsInputSchema>;


const TrendSchema = z.object({
    topic: z.string().describe("The name of the trending topic."),
    description: z.string().describe("A brief description of why this is trending."),
    contentIdea: z.string().describe("A concrete content idea for this trend."),
});

const IdentifyTrendingTopicsOutputSchema = z.object({
  x: z.array(TrendSchema).describe('Trending topics on X (formerly Twitter).'),
  facebook: z.array(TrendSchema).describe('Trending topics on Facebook.'),
  instagram: z.array(TrendSchema).describe('Trending topics on Instagram.'),
  linkedin: z.array(TrendSchema).describe('Trending topics on LinkedIn.'),
  tiktok: z.array(TrendSchema).describe('Trending topics on TikTok.'),
});
export type IdentifyTrendingTopicsOutput = z.infer<typeof IdentifyTrendingTopicsOutputSchema>;


export async function identifyTrendingTopics(input: IdentifyTrendingTopicsInput): Promise<IdentifyTrendingTopicsOutput> {
  return identifyTrendingTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyTrendingTopicsPrompt',
  input: {schema: IdentifyTrendingTopicsInputSchema},
  output: {schema: IdentifyTrendingTopicsOutputSchema},
  prompt: `You are a social media trend analyst. Based on the provided industry and keywords, generate the top 3-5 trending topics for each major social media platform: X (formerly Twitter), Facebook, Instagram, LinkedIn, and TikTok.

Industry: {{{industry}}}
{{#if products}}Products: {{{products}}}{{/if}}
{{#if services}}Services: {{{services}}}{{/if}}
{{#if buyingHabits}}Buying Habits: {{{buyingHabits}}}{{/if}}
{{#if entertainment}}Entertainment: {{{entertainment}}}{{/if}}

For each platform, provide a list of trending topics. For each topic, include:
1. A short, catchy title for the trend (topic).
2. A brief description of the trend and why it's popular.
3. A specific content idea that a brand in this industry could use.
`,
});

const identifyTrendingTopicsFlow = ai.defineFlow(
  {
    name: 'identifyTrendingTopicsFlow',
    inputSchema: IdentifyTrendingTopicsInputSchema,
    outputSchema: IdentifyTrendingTopicsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
