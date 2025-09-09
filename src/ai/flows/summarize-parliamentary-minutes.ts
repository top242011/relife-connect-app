'use server';
/**
 * @fileOverview Summarizes parliamentary meeting minutes, identifies key topics, and suggests relevant tags.
 *
 * - summarizeParliamentaryMinutes - A function that handles the summarization of parliamentary meeting minutes.
 * - SummarizeParliamentaryMinutesInput - The input type for the summarizeParliamentaryMinutes function.
 * - SummarizeParliamentaryMinutesOutput - The return type for the summarizeParliamentaryMinutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeParliamentaryMinutesInputSchema = z.object({
  minutes: z
    .string()
    .describe('The content of the parliamentary meeting minutes.'),
});
export type SummarizeParliamentaryMinutesInput = z.infer<
  typeof SummarizeParliamentaryMinutesInputSchema
>;

const SummarizeParliamentaryMinutesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the meeting minutes.'),
  topics: z
    .array(z.string())
    .describe('A list of key topics discussed in the minutes.'),
  tags: z
    .array(z.string())
    .describe('Suggested tags for categorizing the minutes.'),
  decisions: z
    .array(z.string())
    .describe('A list of key decisions made during the meeting'),
});
export type SummarizeParliamentaryMinutesOutput = z.infer<
  typeof SummarizeParliamentaryMinutesOutputSchema
>;

export async function summarizeParliamentaryMinutes(
  input: SummarizeParliamentaryMinutesInput
): Promise<SummarizeParliamentaryMinutesOutput> {
  return summarizeParliamentaryMinutesFlow(input);
}

const summarizeParliamentaryMinutesPrompt = ai.definePrompt({
  name: 'summarizeParliamentaryMinutesPrompt',
  input: {schema: SummarizeParliamentaryMinutesInputSchema},
  output: {schema: SummarizeParliamentaryMinutesOutputSchema},
  prompt: `You are an AI assistant helping to summarize parliamentary meeting minutes, extract key topics, suggest relevant tags, and identify key decisions.

  Please provide:
  - A concise summary of the meeting minutes.
  - A list of key topics discussed.
  - Suggested tags for categorization.
  - A list of key decisions made during the meeting.

  Minutes: {{{minutes}}}`,
});

const summarizeParliamentaryMinutesFlow = ai.defineFlow(
  {
    name: 'summarizeParliamentaryMinutesFlow',
    inputSchema: SummarizeParliamentaryMinutesInputSchema,
    outputSchema: SummarizeParliamentaryMinutesOutputSchema,
  },
  async input => {
    const {output} = await summarizeParliamentaryMinutesPrompt(input);
    return output!;
  }
);
