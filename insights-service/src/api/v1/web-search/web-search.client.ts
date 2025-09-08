import Exa from 'exa-js';
import { SearchOptions } from './web-search.types';
import { ISearchResult } from '../insights/insights.model';

const getExaClient = () => {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    throw new Error('EXA_API_KEY environment variable is required');
  }
  return new Exa(apiKey);
};

export const search = async (query: string, options: SearchOptions = {}): Promise<ISearchResult[]> => {
  try {
    const client = getExaClient();
    const searchOptions = {
      numResults: options.numResults || 5,
    };

    const response = await client.search(query, searchOptions);

    return response.results.map((result) => ({
      title: result.title || '',
      url: result.url,
    }));
  } catch (error) {
    console.error('Web search error:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Search failed: ${message}`);
  }
};
