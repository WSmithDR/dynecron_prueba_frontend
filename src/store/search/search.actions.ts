import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchDocuments } from '../../services/searchService';
import type { SearchResponse } from './search.types';

export const searchAction = createAsyncThunk<SearchResponse, { query: string; page?: number }, { rejectValue: string }>(
  'search/searchDocuments',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await searchDocuments(query, page);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al buscar documentos';
      return rejectWithValue(errorMessage);
    }
  }
);

export const setQuery = (query: string) => ({
  type: 'search/setQuery',
  payload: query,
});

export const clearSearch = () => ({
  type: 'search/clearSearch',
});
