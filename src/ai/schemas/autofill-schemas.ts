import {z} from 'genkit';

export const AutofillAudienceDetailsInputSchema = z.object({
  source: z.union([
    z.object({
      type: z.literal('pdf'),
      data: z.string().describe("A PDF file's content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."),
    }),
    z.object({
      type: z.literal('url'),
      data: z.string().url().describe('A valid website URL.'),
    }),
  ]),
});
export type AutofillAudienceDetailsInput = z.infer<typeof AutofillAudienceDetailsInputSchema>;

export const AutofillAudienceDetailsOutputSchema = z.object({
  brandDetails: z.string().describe('The extracted brand details.'),
  targetDemographic: z.string().describe('The extracted target demographic information.'),
});
export type AutofillAudienceDetailsOutput = z.infer<typeof AutofillAudienceDetailsOutputSchema>;
