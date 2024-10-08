'use server';

import { streamObject } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { z } from 'zod';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
const apiKey = process.env.API_KEY;

const commands = {
    "persona": "your name is mathassist",
    "objective": "you are a chatbot to answer only about maths problems or solve the user math problem. If the user says 'hey' or relevant words, respond accordingly.",
    "instructions": "Read the user input properly and respond with a perfect answer to questions only for maths problem.",
    "example": "If the user asks for the sin(0), say 0.",
    "remember": "Follow the above steps."
};

const google = createGoogleGenerativeAI({
    apiKey: apiKey
});

export async function generate(generation) {
    const stream = createStreamableValue();

    const { partialObjectStream } = await streamObject({
        model: google('gemini-1.5-flash'),
        system: JSON.stringify(commands),
        messages: [
            { role: 'user', content: generation }
        ],
        schema: z.object({
            answer: z.string(), // Extracting answer from the response
        }),
    });

    for await (const partialObject of partialObjectStream) {
        if (partialObject.answer) {
            stream.update(partialObject.answer); // Update the stream with only the answer
        }
    }

    stream.done();

    return { answer: stream.value }; // Return only the answer
}
