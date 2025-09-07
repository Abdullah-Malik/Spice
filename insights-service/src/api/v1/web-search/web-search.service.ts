import { search as webSearch } from './web-search.client';
import { SearchOptions } from './web-search.types';
import { ISearchResult } from '../insights/insights.model';

export const search = async (query: string, options: SearchOptions = {}): Promise<ISearchResult[]> => {
  try {
    return await webSearch(query, options);
  } catch (error) {
    console.error(`Web search failed for query "${query}":`, error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Web search failed: ${message}`);
  }
};

export const getSearchEngineResults = async (
  queries: string[],
  options: SearchOptions = {}
): Promise<ISearchResult[]> => {
  try {
    const allResults: ISearchResult[] = [];

    // Search each query and combine results
    for (const query of queries) {
      const results = await search(query, options);
      allResults.push(...results);
    }

    // Remove duplicates based on URL
    const uniqueResults = allResults.filter(
      (result, index, array) => array.findIndex((r) => r.url === result.url) === index
    );

    return uniqueResults;
  } catch (error) {
    console.error('Multiple query search failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Multiple query search failed: ${message}`);
  }
};
