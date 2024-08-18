"use server";

import OpenAI from 'openai';

const DEFAULT_RICH_TEXT_PROMPT = "Your output will be displayed in a tinymce textbox. Output in rich text format.";
const DEFAULT_API_KEY = process.env.OPENAI_API_KEY;

let openaiInstance = null;

const getOpenAIClient = (apiKey) => {
  if (!openaiInstance || openaiInstance.apiKey !== apiKey) {
    openaiInstance = new OpenAI({
      apiKey: apiKey || DEFAULT_API_KEY, // Use the user-provided key or fallback to env variable
      dangerouslyAllowBrowser: true
    });
  }
  return openaiInstance;
};

export const sendToOpenAI = async (inputContent, apiKey) => {
  const openai = getOpenAIClient(apiKey);
  
  try {
    console.log('Sending request with input content:', inputContent);
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: DEFAULT_RICH_TEXT_PROMPT },
        { role: "user", content: inputContent }
      ],
      model: "gpt-4o-mini",
    });

    console.log('Response received:', response);
    const text = response.choices[0].message.content;
    console.log('Output content set:', text);
    return text;
  } catch (error) {
    console.error('Error sending the request', error);
    throw error;
  }
};

export const streamToOpenAI = async (inputContent, apiKey, onData) => {
  const openai = getOpenAIClient(apiKey);
  
  try {
    console.log('Sending streaming request with input content:', inputContent);
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: DEFAULT_RICH_TEXT_PROMPT },
        { role: 'user', content: inputContent },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      onData(content);
    }
  } catch (error) {
    console.error('Error sending the streaming request', error);
    throw error;
  }
};

export const OpenAIStream = async (inputContent, apiKey) => {
  return new ReadableStream({
    async start(controller) {
      await streamToOpenAI(inputContent, apiKey, (data) => {
        const encoder = new TextEncoder();
        const chunk = encoder.encode(data);
        controller.enqueue(chunk);
      });
      controller.close();
    }
  });
};
