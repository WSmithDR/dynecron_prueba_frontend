import { LoadingState } from '..';

export interface SearchResult {
  text: string;
  documentName: string;  // Changed from 'document' to match backend
  relevanceScore: number; // Changed from 'score' to match backend
  page?: number; // Optional page number if needed for frontend
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  error?: string;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  loading: LoadingState;
  error: string | null;
}
