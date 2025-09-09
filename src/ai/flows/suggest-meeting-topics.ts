'use server';

/**
 * @fileOverview A flow for suggesting relevant tags and a summary for meeting minutes.
 *
 * - suggestMeetingTopics - A function that handles the suggestion of meeting topics and summary.
 * - SuggestMeetingTopicsInput - The input type for the suggestMeetingTopics function.
 * - SuggestMeetingTopicsOutput - The return type for the suggestMeetingTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMeetingTopicsInputSchema = z.object({
  minutes: z
    .string()
    .describe('The meeting minutes text to analyze and suggest topics and a summary for.'),
});
export type SuggestMeetingTopicsInput = z.infer<typeof SuggestMeetingTopicsInputSchema>;

const SuggestMeetingTopicsOutputSchema = z.object({
  suggestedTags: z.array(z.string()).describe('Suggested tags for the meeting minutes.'),
  summary: z.string().describe('A short summary of the meeting minutes.'),
  keyDecisions: z.array(z.string()).describe('Key decisions made during the meeting.'),
});
export type SuggestMeetingTopicsOutput = z.infer<typeof SuggestMeetingTopicsOutputSchema>;

export async function suggestMeetingTopics(input: SuggestMeetingTopicsInput): Promise<SuggestMeetingTopicsOutput> {
  return suggestMeetingTopicsFlow(input);
}

const suggestMeetingTopicsPrompt = ai.definePrompt({
  name: 'suggestMeetingTopicsPrompt',
  input: {schema: SuggestMeetingTopicsInputSchema},
  output: {schema: SuggestMeetingTopicsOutputSchema},
  prompt: `You are an AI assistant helping to categorize and summarize meeting minutes.

  Given the following meeting minutes, please suggest relevant tags, a short summary, and identify key decisions made during the meeting.

  Minutes: {{{minutes}}}

  Please format the output as a JSON object with the following keys:
  - suggestedTags: An array of strings representing the suggested tags.
  - summary: A string containing a short summary of the meeting minutes.
  - keyDecisions: An array of strings representing key decisions made.`,
});

const suggestMeetingTopicsFlow = ai.defineFlow(
  {
    name: 'suggestMeetingTopicsFlow',
    inputSchema: SuggestMeetingTopicsInputSchema,
    outputSchema: SuggestMeetingTopicsOutputSchema,
  },
  async input => {
    const {output} = await suggestMeetingTopicsPrompt(input);
    return output!;
  }
);
