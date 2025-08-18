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
    .array(z.string())
    .describe('The social media platforms to search for trending topics on.'),
});
export type IdentifyTrendingTopicsInput = z.infer<typeof IdentifyTrendingTopicsInputSchema>;

const TrendingTopicSchema = z.object({
  topic: z.string().describe('The name of the trending topic.'),
  explanation: z.string().describe('A brief explanation of why this topic is currently trending.'),
  contentIdea: z.string().describe('A concrete content idea for how to leverage this trend.'),
});

const IdentifyTrendingTopicsOutputSchema = z.object({
  trendingTopics: z.record(z.string(), z.array(TrendingTopicSchema)).describe(
    'A record of trending topics for each platform, where the key is the platform name and the value is an array of trending topics with explanations and content ideas.'
  ),
});
export type IdentifyTrendingTopicsOutput = z.infer<typeof IdentifyTrendingTopicsOutputSchema>;

export async function identifyTrendingTopics(input: IdentifyTrendingTopicsInput): Promise<IdentifyTrendingTopicsOutput> {
  return identifyTrendingTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyTrendingTopicsPrompt',
  input: {schema: z.object({
    niche: z.string(),
    platforms: z.string(),
  })},
  config: {
    // Explicitly ask for JSON output.
    format: 'json',
  },
  prompt: `You are an expert social media analyst. Your job is to identify trending topics for a given niche on specified social media platforms.

Niche: {{{niche}}}
Platforms: {{{platforms}}}

For each platform, provide a list of 3-5 relevant trending topics. For each topic, you must include:
1.  **topic**: The name of the trend.
2.  **explanation**: A brief, clear explanation of why this topic is currently trending.
3.  **contentIdea**: A concrete, actionable content idea for a post that leverages this trend for the specified niche.

Your output should be a JSON object with a single key "trendingTopics", where the value is an object. Each key in this nested object should be a platform name, and its value should be an array of trend objects.
`,
});

const identifyTrendingTopicsFlow = ai.defineFlow(
  {
    name: 'identifyTrendingTopicsFlow',
    inputSchema: IdentifyTrendingTopicsInputSchema,
    outputSchema: IdentifyTrendingTopicsOutputSchema,
  },
  async (input) => {
    const {text} = await prompt({
        niche: input.niche,
        platforms: input.platforms.join(', '),
    });

    // Manually parse the JSON output from the model.
    const parsedOutput = JSON.parse(text);
    
    // Validate the parsed output against the Zod schema.
    const validationResult = IdentifyTrendingTopicsOutputSchema.safeParse(parsedOutput);

    if (!validationResult.success) {
      console.error("AI output validation failed:", validationResult.error);
      throw new Error("The AI returned data in an unexpected format.");
    }
    
    return validationResult.data;
  }
);
