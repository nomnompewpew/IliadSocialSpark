'use server';

/**
 * @fileOverview AI agent that generates high-performing post captions and scripts for various platforms and content formats, tailored to user's brand.
 *
 * - generateContentCaptions - A function that handles the content caption generation process.
 * - GenerateContentCaptionsInput - The input type for the generateContentCaptions function.
 * - GenerateContentCaptionsOutput - The return type for the generateContentCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentCaptionsInputSchema = z.object({
  brandDescription: z.string().describe('A detailed description of the brand, including its values, mission, and target audience.'),
  platform: z.enum(['Instagram', 'TikTok', 'LinkedIn', 'X', 'Facebook']).describe('The social media platform for which the content is being created.'),
  contentFormat: z.enum(['Carousel', 'Video', 'Story', 'Reel', 'Post']).describe('The format of the content (e.g., carousel, video, story).'),
  topic: z.string().describe('The topic of the content.'),
  keywords: z.string().describe('Relevant keywords to include in the content.'),
  numberOfCaptions: z.number().int().min(1).max(5).default(3).describe('The number of captions/scripts to generate.'),
  strategy: z.object({
    platformStrategy: z.string().describe('The high-level strategy for the specified platform.'),
    tactics: z.object({
      postingTimes: z.string().describe('Optimal days and times to post.'),
      hashtagStrategy: z.string().describe('A relevant hashtag strategy.'),
      growthHacks: z.string().describe('Actionable growth hacks for the platform.'),
    }).describe('Specific tactics for the platform.'),
  }).optional().describe('The social media strategy and tactics for the selected platform. If provided, the generated content should align with this strategy.'),
});

export type GenerateContentCaptionsInput = z.infer<typeof GenerateContentCaptionsInputSchema>;

const GenerateContentCaptionsOutputSchema = z.object({
  captions: z.array(z.string()).describe('An array of generated captions/scripts.'),
});

export type GenerateContentCaptionsOutput = z.infer<typeof GenerateContentCaptionsOutputSchema>;

export async function generateContentCaptions(input: GenerateContentCaptionsInput): Promise<GenerateContentCaptionsOutput> {
  return generateContentCaptionsFlow(input);
}

const generateContentCaptionsPrompt = ai.definePrompt({
  name: 'generateContentCaptionsPrompt',
  input: {schema: GenerateContentCaptionsInputSchema},
  output: {schema: GenerateContentCaptionsOutputSchema},
  prompt: `You are a social media expert specializing in creating engaging content.

  Based on the brand description, platform, content format, topic and keywords provided, generate multiple high-performing post captions or scripts.

  Brand Description: {{{brandDescription}}}
  Platform: {{{platform}}}
  Content Format: {{{contentFormat}}}
  Topic: {{{topic}}}
  Keywords: {{{keywords}}}

  {{#if strategy}}
  The content MUST align with the following strategy for {{{platform}}}:
  - Overall Strategy: {{{strategy.platformStrategy}}}
  - Posting Times Guide: {{{strategy.tactics.postingTimes}}}
  - Hashtag Guide: {{{strategy.tactics.hashtagStrategy}}}
  - Growth Hacks to consider: {{{strategy.tactics.growthHacks}}}
  {{/if}}

  Generate {{{numberOfCaptions}}} captions/scripts that are tailored to the brand and optimized for the specified platform and content format. Return captions as a list.
  `,
});

const generateContentCaptionsFlow = ai.defineFlow(
  {
    name: 'generateContentCaptionsFlow',
    inputSchema: GenerateContentCaptionsInputSchema,
    outputSchema: GenerateContentCaptionsOutputSchema,
  },
  async input => {
    const {output} = await generateContentCaptionsPrompt(input);
    return output!;
  }
);
