import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { SearchState } from './search.types';

const selectSearchState = (state: RootState): SearchState => state.search;

export const selectSearchQuery = createSelector(
  [selectSearchState],
  (search) => search.query
);

export const selectSearchResults = createSelector(
  [selectSearchState],
  (search) => search.results
);

export const selectSearchLoading = createSelector(
  [selectSearchState],
  (search) => search.loading
);

export const selectSearchError = createSelector(
  [selectSearchState],
  (search) => search.error
);

export const selectSearchPagination = createSelector(
  [selectSearchState],
  (search) => ({
    currentPage: search.currentPage,
    pageSize: search.pageSize,
    totalResults: search.totalResults,
    totalPages: search.totalPages,
  })
);
