'use server';
/**
 * @fileOverview This file defines a Genkit flow for creating a social media strategy.
 *
 * - createSocialMediaStrategy - A function that generates a tailored social media strategy.
 * - CreateSocialMediaStrategyInput - The input type for the createSocialMediaStrategy function.
 * - CreateSocialMediaStrategyOutput - The return type for the createSocialMediaStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateSocialMediaStrategyInputSchema = z.object({
  brandName: z.string().describe('The name of the brand.'),
  brandDescription: z.string().describe('A detailed description of the brand, its mission, and values.'),
  targetAudience: z.string().describe('Description of the target audience, including demographics, interests, and online behavior.'),
  goals: z.string().describe('The goals of the social media strategy (e.g., increase brand awareness, drive website traffic, generate leads).'),
});
export type CreateSocialMediaStrategyInput = z.infer<typeof CreateSocialMediaStrategyInputSchema>;

const PlatformStrategySchema = z.object({
  strategy: z.string().describe('The high-level strategy for the platform.'),
  tactics: z.object({
    postingTimes: z.string().describe('Optimal days and times to post.'),
    hashtagStrategy: z.string().describe('A relevant hashtag strategy.'),
    growthHacks: z.string().describe('Actionable growth hacks for the platform.'),
  }).describe('Specific tactics for the platform.'),
});


const CreateSocialMediaStrategyOutputSchema = z.object({
  instagram: PlatformStrategySchema.describe('The strategy and tactics for Instagram.'),
  tiktok: PlatformStrategySchema.describe('The strategy and tactics for TikTok.'),
  linkedin: PlatformStrategySchema.describe('The strategy and tactics for LinkedIn.'),
  x: PlatformStrategySchema.describe('The strategy and tactics for X (formerly Twitter).'),
});
export type CreateSocialMediaStrategyOutput = z.infer<typeof CreateSocialMediaStrategyOutputSchema>;

export async function createSocialMediaStrategy(input: CreateSocialMediaStrategyInput): Promise<CreateSocialMediaStrategyOutput> {
  return createSocialMediaStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createSocialMediaStrategyPrompt',
  input: {schema: CreateSocialMediaStrategyInputSchema},
  output: {schema: CreateSocialMediaStrategyOutputSchema},
  prompt: `You are an expert social media strategist. Develop a comprehensive social media strategy and specific tactics for Instagram, TikTok, LinkedIn, and X (formerly Twitter) based on the following brand specifics:

Brand Name: {{{brandName}}}
Brand Description: {{{brandDescription}}}
Target Audience: {{{targetAudience}}}
Goals: {{{goals}}}

For each platform, provide the following:
1.  **Strategy**: A high-level plan outlining the approach to content, tone, and audience engagement.
2.  **Tactics**:
    *   **Optimal Posting Times**: Suggest the best days and times to post to maximize reach.
    *   **Hashtag Strategy**: Provide a mix of relevant niche, broad, and community-specific hashtags.
    *   **Growth Hacks**: List actionable, platform-specific tips to accelerate audience growth.

Generate a complete response for all four platforms.
`,
});

const createSocialMediaStrategyFlow = ai.defineFlow(
  {
    name: 'createSocialMediaStrategyFlow',
    inputSchema: CreateSocialMediaStrategyInputSchema,
    outputSchema: CreateSocialMediaStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
