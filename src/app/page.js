'use client';

import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TINYMCE_API_KEY = "tq9ywmke8tnt4fp3k7nlfu6slafmm644kx7fj7i56vk97nie";

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
          <Editor
            apiKey={TINYMCE_API_KEY}
            init={{
              branding: false,
              height: '100%',
              menubar: false,
              placeholder: 'Start typing...',
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'paste', // Add the paste plugin
                // 'powerpaste', // Add the PowerPaste plugin
                'code', // Add the code plugin
                'table', // Add the table plugin
                'image', // Add the image plugin
                'media', // Add the media plugin
                'emoticons', // Add the emoticons plugin
              ],
              toolbar: 
                'undo redo | formatselect | fontselect fontsizeselect | ' +
                'bold italic underline strikethrough | forecolor backcolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | removeformat | ' +
                'link image media | code | table | emoticons',
              paste_as_text: false, // Ensure styles are retained
              paste_data_images: true, // Allow pasting images
              powerpaste_allow_local_images: true, // Enable local image handling
              powerpaste_word_import: 'merge', // Options: 'clean', 'merge'
              powerpaste_html_import: 'merge', // Options: 'clean', 'merge'
              powerpaste_googledocs_import: 'merge',
            }}
            onEditorChange={handleEditorChange}
          />
        </div>
        <div className="editor-wrapper readonly-editor">
          <Editor
            apiKey={TINYMCE_API_KEY}
            value={outputContent}
            init={{
              branding: false,
              height: '100%',
              menubar: false,
              toolbar: false,
              readonly: true,
            }}
          />
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
