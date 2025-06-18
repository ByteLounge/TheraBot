
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

const AIChatbotMessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
  isUser: z.boolean().optional(), // Added for template logic
});

const AIChatbotInputSchema = z.object({
  userInput: z.string().describe('The user input message.'),
  chatHistory: z.array(AIChatbotMessageSchema).optional().describe('The chat history between the user and the bot.'),
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
  input: {schema: AIChatbotInputSchema}, // This schema now includes isUser in chatHistory messages
  output: {schema: AIChatbotOutputSchema},
  prompt: `You are a mental health support chatbot providing empathetic and helpful responses. 

Respond to the following user input, taking into account the chat history.

Chat History:
{{#each chatHistory}}
  {{#if isUser}}
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
  async (input) => {
    // Process chatHistory to add the isUser flag for the template
    const processedChatHistory = input.chatHistory?.map(message => ({
      ...message,
      isUser: message.role === 'user',
    }));

    const promptInput = {
      ...input,
      chatHistory: processedChatHistory,
    };

    const {output} = await prompt(promptInput);
    return output!;
  }
);
