// This is an AI chatbot flow for mental health support.

'use server';

/**
 * @fileOverview An AI chatbot that provides empathetic and helpful mental health support.
 *
 * - interactWithAIChatbot - A function that handles the interaction with the AI chatbot.
 * - AIChatbotInput - The input type for the interactWithAIChatbot function.
 * - AIChatbotOutput - The return type for the interactWithAIChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotInputSchema = z.object({
  userInput: z.string().describe('The user input message.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the bot.'),
});
export type AIChatbotInput = z.infer<typeof AIChatbotInputSchema>;

const AIChatbotOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot.'),
});
export type AIChatbotOutput = z.infer<typeof AIChatbotOutputSchema>;

export async function interactWithAIChatbot(input: AIChatbotInput): Promise<AIChatbotOutput> {
  return interactWithAIChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: `You are a mental health support chatbot providing empathetic and helpful responses. 

Respond to the following user input, taking into account the chat history.

Chat History:
{{#each chatHistory}}
  {{#if (eq role \"user\")}}
    User: {{{content}}}
  {{else}}
    Bot: {{{content}}}
  {{/if}}
{{/each}}

User Input: {{{userInput}}}

Response: `,
});

const interactWithAIChatbotFlow = ai.defineFlow(
  {
    name: 'interactWithAIChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
