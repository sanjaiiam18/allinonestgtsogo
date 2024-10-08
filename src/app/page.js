// File: app/page.js
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AIFunctionButton = ({ onClick, label }) => (
  <button className="ai-function-button" onClick={onClick}>
    {label}
  </button>
);

export default function Home() {
  const router = useRouter();

  const aiFunctions = [
    { path: '/streamtext', label: 'Stream Text' },
    { path: '/streamobj', label: 'Stream Object' },
    { path: '/gentext', label: 'Generate Text' },
    { path: '/genobj', label: 'Generate Object' },
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="ai-function-selector">
      <h1>Select an AI Function</h1>
      <div className="button-container">
        {aiFunctions.map((func, index) => (
          <AIFunctionButton 
            key={index} 
            label={func.label} 
            onClick={() => handleNavigation(func.path)}
          />
        ))}
      </div>
    </div>
  );
}
