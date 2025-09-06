import { SearchResult as ExaSearchResult } from 'exa-js';

export interface SearchOptions {
  numResults?: number;
}

export type SearchResult = ExaSearchResult<{ summary: true }>;
