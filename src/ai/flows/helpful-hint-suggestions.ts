'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating helpful suggestions
 * for citizens formulating requests to SERNAMEG. It takes the request type and
 * user's input text as input and returns AI-generated suggestions for better clarity.
 *
 * - `getHelpfulHintSuggestions` - A function that generates helpful hint suggestions for the user's request.
 * - `HelpfulHintSuggestionsInput` - The input type for the `getHelpfulHintSuggestions` function.
 * - `HelpfulHintSuggestionsOutput` - The return type for the `getHelpfulHintSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HelpfulHintSuggestionsInputSchema = z.object({
  requestType: z.enum(['Reclamo', 'Consulta', 'Sugerencia', 'Queja']).describe('The type of request (Reclamo, Consulta, Sugerencia, or Queja).'),
  inputText: z.string().describe('The user-provided text for the request.'),
});
export type HelpfulHintSuggestionsInput = z.infer<typeof HelpfulHintSuggestionsInputSchema>;

const HelpfulHintSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of AI-generated suggestions for improving the request formulation.'),
});
export type HelpfulHintSuggestionsOutput = z.infer<typeof HelpfulHintSuggestionsOutputSchema>;

export async function getHelpfulHintSuggestions(input: HelpfulHintSuggestionsInput): Promise<HelpfulHintSuggestionsOutput> {
  return helpfulHintSuggestionsFlow(input);
}

const helpfulHintSuggestionsPrompt = ai.definePrompt({
  name: 'helpfulHintSuggestionsPrompt',
  input: {schema: HelpfulHintSuggestionsInputSchema},
  output: {schema: HelpfulHintSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping citizens formulate their requests to SERNAMEG.

  Given the type of request and the user's input text, generate a list of suggestions on how to best formulate the request so it is clear and effective.

  Request Type: {{{requestType}}}
  Input Text: {{{inputText}}}

  Suggestions:`, // Handlebars syntax is used here
});

const helpfulHintSuggestionsFlow = ai.defineFlow(
  {
    name: 'helpfulHintSuggestionsFlow',
    inputSchema: HelpfulHintSuggestionsInputSchema,
    outputSchema: HelpfulHintSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await helpfulHintSuggestionsPrompt(input);
    return output!;
  }
);
