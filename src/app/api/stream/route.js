import { NextResponse } from 'next/server';
import { OpenAIStream } from '@/app/api/openaiClient';
import { checkSecretKeyExists } from '@/lib/firebase/db';

const DEFAULT_API_KEY = process.env.OPENAI_API_KEY;

function isValidApiKey(input) {
  const apiKeyPattern = /^sk-[A-Za-z0-9]{32,}$/;
  return apiKeyPattern.test(input);
}

async function getApiKeyToUse(userApiKeyOrSecret) {
  const cleanedKey = userApiKeyOrSecret.trim();

  if (isValidApiKey(cleanedKey)) {
    // It's a valid OpenAI API key
    return cleanedKey;
  } else if (cleanedKey.endsWith('#')) {
    // Potential secret key
    const cleanedSecretKey = cleanedKey.slice(0, -1);
    const isSecretKeyValid = await checkSecretKeyExists(cleanedSecretKey);
    if (isSecretKeyValid) {
      // Use the default API key if the secret key is valid
      return DEFAULT_API_KEY;
    }
  }

  throw new Error('Invalid API key or secret key.');
}

export async function POST(req) {
  const { inputContent, apiKey } = await req.json();

  if (!DEFAULT_API_KEY) {
    return NextResponse.json({ error: 'API key not found on server.' }, { status: 500 });
  }

  try {
    const apiKeyToUse = await getApiKeyToUse(apiKey);
    const stream = await OpenAIStream(inputContent, apiKeyToUse);
    return new Response(stream);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
