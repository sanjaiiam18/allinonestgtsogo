'use server';

import { createStreamableValue } from 'ai/rsc';
import { streamText } from 'ai';
import {createOpenAI, openai} from '@ai-sdk/openai';
const apikey="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";
export async function continueConversation(messages) {
  'use server';
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: apikey,
  });
  
  
  const result = await streamText({
    model:groq('llama3-8b-8192'),
    messages,
  });
  
  const data = { test: 'hello' };
  const stream = createStreamableValue(result.textStream);
  
  return { message: stream.value, data };
}
