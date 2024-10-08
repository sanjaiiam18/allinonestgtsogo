'use client';

import { useChat } from 'ai/react';
import "./globals.css"
import Markdown from 'markdown-to-jsx'



export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  
  return (
    <div className="response">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`message-box ${m.role === 'user' ? 'user' : 'bitbot'}`} 
        >
          {m.role === 'user'}
          <Markdown>{m.content}</Markdown>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="textbox"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
