import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchDocuments } from '../../services/searchService';

export const searchAction = createAsyncThunk(
  'search/searchDocuments',
  async (
    { query, page = 1 }: { query: string; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchDocuments(query, page);
      return response;
    } catch (error) {
      return rejectWithValue('Error al buscar documentos');
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
