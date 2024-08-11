'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { streamToOpenAI } from '@/app/api/openaiClient';
import { checkSecretKeyExists } from '@/lib/firebase/db'; // Import the function

const TINYMCE_API_KEY = "tq9ywmke8tnt4fp3k7nlfu6slafmm644kx7fj7i56vk97nie";

function isValidApiKey(input) {
  const apiKeyPattern = /^sk-[A-Za-z0-9]{32,}$/; // Check if the input matches an API key pattern.

  if (apiKeyPattern.test(input)) {
    return true; // It's an API key.
  }

  if (input.length < 30) {
    return false;
  }

  return false;
}

export default function RichTextGPTPage() {
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [userApiKey, setUserApiKey] = useState('');
  const [isSecretKeyValid, setIsSecretKeyValid] = useState(false);
  const [isCheckingSecret, setIsCheckingSecret] = useState(false);

  const handleEditorChange = (content, editor) => {
    setInputContent(content);
  };

  useEffect(() => {
    const checkSecretKey = async () => {
      const apiKeyOrSecret = userApiKey.trim();
      if (!isValidApiKey(apiKeyOrSecret) && apiKeyOrSecret.endsWith('#')) {
        const cleanedKey = apiKeyOrSecret.slice(0, -1); // Remove the trailing '#'
        setIsCheckingSecret(true); // Set checking state to true
        try {
          const exists = await checkSecretKeyExists(cleanedKey);
          setIsSecretKeyValid(exists);
        } catch (error) {
          console.error('Error checking secret key:', error);
          setIsSecretKeyValid(false);
        } finally {
          setIsCheckingSecret(false); // Set checking state to false after check completes
        }
      } else {
        setIsSecretKeyValid(false);
      }
    };

    checkSecretKey();
  }, [userApiKey]); // Re-run the effect when userApiKey changes

  const handleSend = async () => {
    const apiKeyOrSecret = userApiKey.trim();
    const useSecretKey = !isValidApiKey(apiKeyOrSecret) && isSecretKeyValid;

    setOutputContent(''); // Clear the output before new streaming
    try {
      await streamToOpenAI(inputContent, useSecretKey ? null : apiKeyOrSecret, (data) => {
        setOutputContent((prevContent) => prevContent + data);
      });
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
                'powerpaste', // Add the PowerPaste plugin
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
              powerpaste_word_import: 'clean', // Options: 'clean', 'merge'
              powerpaste_html_import: 'clean', // Options: 'clean', 'merge'
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
      <button 
        onClick={handleSend} 
        disabled={isCheckingSecret}
        style={{
          backgroundColor: isCheckingSecret ? '#cccccc' : '#007bff', // Gray out when disabled
          cursor: isCheckingSecret ? 'not-allowed' : 'pointer', // Change cursor style when disabled
        }}
      >
        {isCheckingSecret ? 'Checking...' : 'Send to GPT'}
      </button>
    </div>
  );
}
