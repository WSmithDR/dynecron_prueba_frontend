import { LoadingState } from '..';

export interface SearchResult {
  text: string;
  document: string;
  score: number;
  page?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  currentPage: number;
  totalResults: number;
  loading: LoadingState;
  error: string | null;
}
