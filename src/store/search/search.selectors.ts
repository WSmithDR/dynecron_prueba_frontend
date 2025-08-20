import type { RootState } from '..';
import type { SearchState } from './search.types';

const selectSearchState = (state: RootState): SearchState => state.search;

export const selectSearchQuery = (state: RootState) =>
  selectSearchState(state).query;

export const selectSearchResults = (state: RootState) =>
  selectSearchState(state).results;

export const selectSearchLoading = (state: RootState) =>
  selectSearchState(state).loading;

export const selectSearchError = (state: RootState) =>
  selectSearchState(state).error;

export const selectSearchPagination = (state: RootState) => {
  const { currentPage, totalResults } = selectSearchState(state);
  return { currentPage, totalResults };
};
