// src/ai/flows/create-social-media-strategy.ts
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
  instagramApproach: z.string().optional().describe('Specific approach for Instagram (optional).'),
  tiktokApproach: z.string().optional().describe('Specific approach for TikTok (optional).'),
  linkedinApproach: z.string().optional().describe('Specific approach for LinkedIn (optional).'),
  xApproach: z.string().optional().describe('Specific approach for X (formerly Twitter, optional).'),
});
export type CreateSocialMediaStrategyInput = z.infer<typeof CreateSocialMediaStrategyInputSchema>;

const CreateSocialMediaStrategyOutputSchema = z.object({
  instagramStrategy: z.string().describe('A detailed social media strategy for Instagram.'),
  tiktokStrategy: z.string().describe('A detailed social media strategy for TikTok.'),
  linkedinStrategy: z.string().describe('A detailed social media strategy for LinkedIn.'),
  xStrategy: z.string().describe('A detailed social media strategy for X (formerly Twitter).'),
});
export type CreateSocialMediaStrategyOutput = z.infer<typeof CreateSocialMediaStrategyOutputSchema>;

export async function createSocialMediaStrategy(input: CreateSocialMediaStrategyInput): Promise<CreateSocialMediaStrategyOutput> {
  return createSocialMediaStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createSocialMediaStrategyPrompt',
  input: {schema: CreateSocialMediaStrategyInputSchema},
  output: {schema: CreateSocialMediaStrategyOutputSchema},
  prompt: `You are an expert social media strategist. Develop a comprehensive social media strategy tailored to Instagram, TikTok, LinkedIn, and X (formerly Twitter) based on the following brand specifics:

Brand Name: {{{brandName}}}
Brand Description: {{{brandDescription}}}
Target Audience: {{{targetAudience}}}
Goals: {{{goals}}}

Specific approaches for each platform (if any):
Instagram: {{{instagramApproach}}}
Tiktok: {{{tiktokApproach}}}
LinkedIn: {{{linkedinApproach}}}
X: {{{xApproach}}}

Outline the approach for each platform to maximize reach and engagement. Focus on actionable tactics and platform-specific strategies.

Instagram Strategy:

TikTok Strategy:

LinkedIn Strategy:

X Strategy:
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
