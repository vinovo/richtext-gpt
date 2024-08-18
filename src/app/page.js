'use client';

import React, { useState } from 'react';
import TinyMCEEditor from '@/app/component/tinymce';

export default function RichTextGPTPage() {
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [userApiKey, setUserApiKey] = useState('');

  const handleEditorChange = (content) => {
    setInputContent(content);
  };

  const handleSend = async () => {
    setOutputContent(''); // Clear the output before new streaming

    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputContent,
          apiKey: userApiKey,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setOutputContent((prevContent) => prevContent + chunk);
      }
    } catch (error) {
      console.error('Error sending the request', error);
    }
  };

  return (
    <div className="App">
      <h1>RichTextGPT</h1>
      <div className="editor-container">
        <div className="editor-wrapper">
          <TinyMCEEditor value={inputContent} onChange={handleEditorChange} />
        </div>
        <div className="editor-wrapper readonly-editor">
          <TinyMCEEditor value={outputContent} readonly />
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your OpenAI API Key"
          value={userApiKey}
          className={!userApiKey ? 'placeholder-highlight' : ''}
          onChange={(e) => setUserApiKey(e.target.value)}
        />
      </div>
      <button onClick={handleSend}>Send to GPT</button>
    </div>
  );
}
