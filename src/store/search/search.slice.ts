import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './search.initial-state';
import { searchAction } from './search.actions';

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.currentPage = 1;
      state.totalResults = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAction.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(searchAction.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.results = action.payload.results;
        state.totalResults = action.payload.total;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(searchAction.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = (action.payload as string) || 'Error desconocido al buscar';
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
