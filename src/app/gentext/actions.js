'use server';


import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
const apiKey=process.env.API_KEY
// const commands={
//     "persona":"your name is BITassist",
//     "objective":"you are a chatbot to ans only about bannari amman institute of technology.if user said hey or relavent words respond to that",
//     "instructions":"read the user input properly and respond a perfect answer to that question only on bannari amman institute of technology",
//     "example":"if user ask counselling code say 2702",
//     "remember":"follow above steps"

// }
const google = createGoogleGenerativeAI({
    apiKey:apiKey
  });
export async function continueConversation(history) {
  'use server';

  const { text } = await generateText({
    model: google('gemini-1.5-pro-latest'),
    messages: history,
   
  });

  return {
    messages: [
      ...history,
      {
        role: 'assistant',
        content: text,
      },
    ],
  };
}
