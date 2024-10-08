'use server';

import { generateObject } from 'ai';
import { z } from 'zod';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const apiKey = process.env.API_KEY;
const schema = z.object({
  response: z.object({
    message: z.string(),
    suggestions: z.array(z.string()).optional(),
    metadata: z.object({
      confidence: z.number().min(0).max(1),
      category: z.string(),
    }).optional(),
  }),
});

const systemMessage = `
  Your name is ContentAssist. 
  You are a chatbot that answers only about content creation. 
  If the user says "hey" or similar words, respond to that. 
  Always read the user input carefully and provide a perfect answer only related to content creation.
`;

const google = createGoogleGenerativeAI({
  apiKey: apiKey
});

export async function getNotifications(generation) {
  'use server';

  // Format the messages array according to expected structure
  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: generation }
  ];

  const { object: notifications } = await generateObject({
    model: google('gemini-1.5-pro-latest'),
    messages: messages, // Properly structured messages array
    schema: schema
  });

  // Extract the AI's response message
  const aiResponse = notifications.response.message;

  return { notifications: aiResponse }; // Return only the AI response
}
