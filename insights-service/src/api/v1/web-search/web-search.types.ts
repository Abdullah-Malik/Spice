import { SearchResult as ExaSearchResult } from 'exa-js';

export interface SearchOptions {
  numResults?: number;
}

export type SearchResult = ExaSearchResult<{ summary: true }>;

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: number;
}
