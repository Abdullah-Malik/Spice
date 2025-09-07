import Exa from 'exa-js';
import { WebPageContentResult } from './webpage-content.types';

const getExaClient = () => {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    throw new Error('EXA_API_KEY environment variable is required');
  }
  return new Exa(apiKey);
};

export const getContentFromUrls = async (urls: string[]): Promise<WebPageContentResult> => {
  try {
    const client = getExaClient();

    const response = await client.getContents<{ text: { maxCharacters: number }; context: true }>(urls, {
      text: { maxCharacters: 5000 },
      context: true,
    });

    const results = response.results.map((result) => ({
      url: result.url,
      title: result.title || '',
      content: result.text || '',
    }));

    return { context: response.context || '', results };
  } catch (error) {
    console.error('Webpage content extraction error:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Content extraction failed: ${message}`);
  }
};
