import { getContentFromUrls } from './webpage-content.client';

export const extractContentFromWebPages = async (urls: string[]) => {
  try {
    return await getContentFromUrls(urls);
  } catch (error) {
    console.error('Content extraction failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Content extraction failed: ${message}`);
  }
};
