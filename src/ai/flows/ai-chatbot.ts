
'use server';

/**
 * @fileOverview An AI chatbot that provides empathetic, insightful, and supportive mental health conversations, acting in the role of a psychotherapist.
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
  response: z.string().describe('The response from the AI chatbot, acting as a psychotherapist.'),
});
export type AIChatbotOutput = z.infer<typeof AIChatbotOutputSchema>;

export async function interactWithAIChatbot(input: AIChatbotInput): Promise<AIChatbotOutput> {
  return interactWithAIChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPsychotherapistPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: `You are TheraBot, an AI psychotherapist. Your primary goal is to provide empathetic, insightful, and supportive mental health conversations. 
Engage in a human-like dialogue. Listen actively, ask clarifying and reflective questions, and offer gentle guidance. 
Help the user explore their feelings and thoughts. Avoid giving definitive medical diagnoses, but you can help them understand their emotions and behaviors better.
Maintain a warm, understanding, and professional tone.

Respond to the following user input, taking into account the chat history.

Chat History:
{{#each chatHistory}}
  {{#if isUser}}
    User: {{{content}}}
  {{else}}
    TheraBot: {{{content}}}
  {{/if}}
{{/each}}

User: {{{userInput}}}

TheraBot: `,
});

const interactWithAIChatbotFlow = ai.defineFlow(
  {
    name: 'interactWithAIChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async (input) => {
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
