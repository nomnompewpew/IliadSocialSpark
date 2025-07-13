'use server';

/**
 * @fileOverview A flow for creating a 30-day content calendar.
 *
 * - generateContentCalendar - A function that generates a content calendar.
 * - GenerateContentCalendarInput - The input type for the function.
 * - GenerateContentCalendarOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentCalendarInputSchema = z.object({
  brandDescription: z.string().describe('A detailed description of the brand, its values, and mission.'),
  targetAudience: z.string().describe('Description of the target audience.'),
  goals: z.string().describe('The main goals of the social media campaign.'),
});
export type GenerateContentCalendarInput = z.infer<typeof GenerateContentCalendarInputSchema>;

const CalendarEntrySchema = z.object({
  day: z.number().describe('The day of the month (1-30).'),
  postType: z.enum(['Value', 'Authority', 'Engagement', 'Call to Action']).describe('The type of content for the day.'),
  topic: z.string().describe('The suggested topic for the post.'),
  caption: z.string().describe('A sample caption for the post.'),
});

const GenerateContentCalendarOutputSchema = z.object({
  calendar: z.array(CalendarEntrySchema).describe('A 30-day content calendar plan.'),
});
export type GenerateContentCalendarOutput = z.infer<typeof GenerateContentCalendarOutputSchema>;

export async function generateContentCalendar(
  input: GenerateContentCalendarInput
): Promise<GenerateContentCalendarOutput> {
  return generateContentCalendarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentCalendarPrompt',
  input: {schema: GenerateContentCalendarInputSchema},
  output: {schema: GenerateContentCalendarOutputSchema},
  prompt: `You are an expert social media manager. Based on the provided brand information, create a detailed 30-day content calendar.

The calendar should include a mix of posts designed to provide value, establish authority, drive engagement, and include clear calls to action.

Brand Description: {{{brandDescription}}}
Target Audience: {{{targetAudience}}}
Goals: {{{goals}}}

Generate a 30-day plan. For each day, provide the day number, the type of post, a specific topic, and a sample caption.
`,
});

const generateContentCalendarFlow = ai.defineFlow(
  {
    name: 'generateContentCalendarFlow',
    inputSchema: GenerateContentCalendarInputSchema,
    outputSchema: GenerateContentCalendarOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
