'use server';
/**
 * @fileOverview A flow to search parliamentary data and get snippets and keywords from parliamentary transcripts or reports.
 *
 * - findRelevantParliamentaryData - A function that handles the search process.
 * - FindRelevantParliamentaryDataInput - The input type for the findRelevantParliamentaryData function.
 * - FindRelevantParliamentaryDataOutput - The return type for the findRelevantParliamentaryData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindRelevantParliamentaryDataInputSchema = z.object({
  query: z.string().describe('The search query for parliamentary data.'),
});
export type FindRelevantParliamentaryDataInput = z.infer<typeof FindRelevantParliamentaryDataInputSchema>;

const FindRelevantParliamentaryDataOutputSchema = z.object({
  snippets: z.array(z.string()).describe('Relevant snippets from parliamentary transcripts or reports.'),
  keywords: z.array(z.string()).describe('Keywords extracted from the search results.'),
});
export type FindRelevantParliamentaryDataOutput = z.infer<typeof FindRelevantParliamentaryDataOutputSchema>;

export async function findRelevantParliamentaryData(input: FindRelevantParliamentaryDataInput): Promise<FindRelevantParliamentaryDataOutput> {
  return findRelevantParliamentaryDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findRelevantParliamentaryDataPrompt',
  input: {schema: FindRelevantParliamentaryDataInputSchema},
  output: {schema: FindRelevantParliamentaryDataOutputSchema},
  prompt: `You are an AI assistant helping a researcher find relevant information from parliamentary data.
  Based on the user's query, you will search through parliamentary transcripts and reports and provide relevant snippets and keywords.

  Query: {{{query}}}

  Return snippets that are most relevant to the query and extract keywords that appear frequently in the snippets.
  Ensure the response is well-formatted and easy to understand.
  Snippets should be direct quotes from parliamentary records.
  Keywords should be comma separated.
  `,
});

const findRelevantParliamentaryDataFlow = ai.defineFlow(
  {
    name: 'findRelevantParliamentaryDataFlow',
    inputSchema: FindRelevantParliamentaryDataInputSchema,
    outputSchema: FindRelevantParliamentaryDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
