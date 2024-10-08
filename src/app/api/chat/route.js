
import { streamText, convertToCoreMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
const apiKey = process.env.API_KEY;
const google = createGoogleGenerativeAI({
  apiKey:apiKey
});
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const body = await req.json();
  const { messages } = body;

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
