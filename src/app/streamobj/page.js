'use client';

import { useState } from 'react';
import { generate } from './actions';

export const maxDuration = 30; // Allow streaming responses up to 30 seconds

export default function Home() {
  const [generation, setGeneration] = useState(''); // For user input
  const [messages, setMessages] = useState([]); // Store user and AI messages together

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && generation.trim() !== '') {
      const { answer } = await generate(generation); // Get the answer directly
      const answerString = answer.curr ? answer.curr : ''; // Extract the value of 'curr'

      // Append both user input and AI response to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: generation }, // Add user message
        { type: 'ai', text: answerString }, // Add AI response
      ]);

      // Clear the input field
      setGeneration('');
    }
  };

  return (
    <div className="response">
      {/* Display messages alternately */}
      {messages.map((msg, index) => (
        <div key={index} className={`message-box ${msg.type}`}>
          {msg.text}
        </div>
      ))}

      {/* Input box at the bottom */}
      <div className="responsebox">
        <input
          className="responsebox"
          id="text"
          type="text"
          value={generation}
          onChange={(event) => setGeneration(event.target.value)} // Store user input
          onKeyPress={handleKeyPress} // Trigger on "Enter" key press
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
