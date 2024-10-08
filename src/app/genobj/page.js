'use client';

import { useState } from 'react';
import { getNotifications } from './actions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  // Separate state for input and messages
  const [userInput, setUserInput] = useState(''); // Input text state
  const [messages, setMessages] = useState([]); // Store both user and AI messages

  const handleGetNotifications = async () => {
    // Get notifications based on user input
    const { notifications } = await getNotifications(userInput);

    // Append the user input and AI response to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userInput }, // User message
      { role: 'ai', content: notifications }  // AI response
    ]);

    // Clear input box
    setUserInput('');
  };

  return (
    <div className="page-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <input
        className="responsebox"
        id="text"
        type="text"
        value={userInput} // Bind input state
        onChange={event => setUserInput(event.target.value)} // Update input state
        onKeyDown={event => {
          if (event.key === 'Enter') {
            handleGetNotifications(); // Call function on Enter key press
          }
        }}
      />
    </div>
  );
}
