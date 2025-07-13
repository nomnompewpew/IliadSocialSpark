'use server';

/**
 * @fileOverview A flow for generating audience insights based on brand and target demographic details.
 *
 * - generateAudienceInsights - A function that generates a detailed audience analysis report.
 * - AudienceInsightsInput - The input type for the generateAudienceInsights function.
 * - AudienceInsightsOutput - The return type for the generateAudienceInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AudienceInsightsInputSchema = z.object({
  brandDetails: z
    .string()
    .describe('Detailed information about the brand, its values, and its mission.'),
  targetDemographic: z
    .string()
    .describe(
      'Description of the target demographic, including age, location, interests, and other relevant characteristics.'
    ),
});
export type AudienceInsightsInput = z.infer<typeof AudienceInsightsInputSchema>;

const AudienceInsightsOutputSchema = z.object({
  audienceAnalysisReport: z
    .string()
    .describe(
      'A comprehensive report analyzing the audience, including their pain points, desires, behaviors, and demographics.'
    ),
});
export type AudienceInsightsOutput = z.infer<typeof AudienceInsightsOutputSchema>;

export async function generateAudienceInsights(
  input: AudienceInsightsInput
): Promise<AudienceInsightsOutput> {
  return generateAudienceInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'audienceInsightsPrompt',
  input: {schema: AudienceInsightsInputSchema},
  output: {schema: AudienceInsightsOutputSchema},
  prompt: `You are an expert marketing analyst specializing in understanding social media audiences.

  Based on the provided brand details and target demographic, generate a detailed audience analysis report.
  The report should cover the audience's:
  - Key pain points
  - Desires and aspirations
  - Online behaviors and platform preferences
  - Demographic characteristics

  Brand Details: {{{brandDetails}}}
  Target Demographic: {{{targetDemographic}}}

  Audience Analysis Report:`, // Ensure this is the final text generated
});

const generateAudienceInsightsFlow = ai.defineFlow(
  {
    name: 'generateAudienceInsightsFlow',
    inputSchema: AudienceInsightsInputSchema,
    outputSchema: AudienceInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
