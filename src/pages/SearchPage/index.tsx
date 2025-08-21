import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { searchAction, setQuery, clearSearch } from '../../store/search/search.actions';
import {
  selectSearchResults,
  selectSearchLoading,
  selectSearchError,
  selectSearchPagination
} from '../../store/search/search.selectors';
import SearchForm from '../../components/SearchForm';
import SearchResults from '../../components/SearchResults';
import styles from './index.module.css';

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectSearchResults) || [];
  const loading = useAppSelector(selectSearchLoading);
  const error = useAppSelector(selectSearchError) as string | null;
  const { currentPage, totalResults } = useAppSelector(selectSearchPagination) as { currentPage: number; totalResults: number };
  const [localQuery, setLocalQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Load search query from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('q');
    const pageParam = params.get('page');
    
    if (queryParam) {
      setLocalQuery(queryParam);
      dispatch(setQuery(queryParam));
      
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      if (page > 0) {
        handleSearch(queryParam, page);
      } else {
        handleSearch(queryParam);
      }
      setHasSearched(true);
    }

    return () => {
      dispatch(clearSearch());
    };
  }, [dispatch]);

  const handleSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      return;
    }

    try {
      await dispatch(searchAction({ query, page }));
      
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      url.searchParams.set('page', page.toString());
      window.history.pushState({}, '', url.toString());
      
      setHasSearched(true);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      handleSearch(localQuery);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      handleSearch(localQuery, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchContainer}>
        <h1>Buscar en Documentos</h1>
        <p className={styles.subtitle}>
          Encuentra información relevante en tus documentos cargados
        </p>

        <SearchForm
          query={localQuery}
          loading={loading === 'pending'}
          onSearch={handleSubmit}
          onQueryChange={setLocalQuery}
        />

        <SearchResults
          results={results}
          loading={loading}
          error={error}
          hasSearched={hasSearched}
          totalResults={totalResults}
          currentPage={currentPage}
          totalPages={totalPages}
          searchTerm={localQuery}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SearchPage;
