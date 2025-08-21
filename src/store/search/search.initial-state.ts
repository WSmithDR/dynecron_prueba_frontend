import type { SearchState } from './search.types';

export const initialState: SearchState = {
  query: '',
  results: [],
  currentPage: 1,
  totalResults: 0,
  pageSize: 10,
  totalPages: 0,
  loading: 'idle',
  error: null,
};
