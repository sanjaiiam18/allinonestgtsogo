'use client';

import { useState } from 'react';
import { continueConversation } from './actions';
import Markdown from 'markdown-to-jsx';

export const maxDuration = 30;

export default function Home() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState([]);

  const handleSendMessage = async () => {
    const { messages } = await continueConversation([
      ...conversation,
      { role: 'user', content: input },
    ]);

    // Clear input field by setting state
    setInput(''); 
    setConversation(messages);
  };

  return (
    <div>
      <div className="response">
        {conversation.map((m) => (
          <div key={m.id}
            className={`message-box ${m.role === 'user' ? 'user' : 'bitbot'}`}
          >
            <Markdown>{m.content}</Markdown>
          </div>
        ))}
      </div>

      <div>
        <input
          className="responsebox"
          id="text"
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
          onKeyDown={async (event) => {
            if (event.key === 'Enter') {
              await handleSendMessage();
            }
          }}
        />
      </div>
    </div>
  );
}
