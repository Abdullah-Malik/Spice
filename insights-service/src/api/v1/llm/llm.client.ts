import { GoogleGenAI } from '@google/genai';
import { GenerateOptions } from './llm.types';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({ apiKey });
};

export const generateText = async (contents: string, options: GenerateOptions = {}) => {
  try {
    const client = getGeminiClient();

    const response = await client.models.generateContent({
      model: options.model || 'gemini-2.5-flash',
      contents,
      ...options,
    });

    return response.text;
  } catch (error) {
    console.error('Gemini text generation error:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Text generation failed: ${message}`);
  }
};
