import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { searchAction, setQuery, clearSearch } from '../../store/search/search.actions';
import {
  selectSearchResults,
  selectSearchLoading,
  selectSearchError,
  selectSearchPagination
} from '../../store/search/search.selectors';
import { FaSearch, FaSpinner, FaRegSadTear, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

import Button from '../../components/common/Button';
import styles from './index.module.css';
import Card from '../../components/common/Card';

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

  const highlightTerm = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchContainer}>
        <h1>Buscar en Documentos</h1>
        <p className={styles.subtitle}>
          Encuentra información relevante en tus documentos cargados
        </p>

        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Ingresa tu búsqueda..."
              className={styles.searchInput}
              disabled={loading === 'pending'}
            />
            <Button 
              type="submit" 
              variant="primary"
              className={styles.searchButton}
              disabled={loading === 'pending' || !localQuery.trim()}
            >
              {loading === 'pending' ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <FaSearch />
                  <span>Buscar</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {loading === 'pending' && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinnerContainer}>
              <FaSpinner className={styles.spinnerLarge} />
            </div>
            <p>Buscando en los documentos...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {hasSearched && loading !== 'pending' && (!results || results.length === 0) && (
          <div className={styles.noResults}>
            <FaRegSadTear className={styles.noResultsIcon} />
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otros términos de búsqueda o verifica la ortografía.</p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className={styles.resultsContainer}>
            <div className={styles.resultsHeader}>
              <h2>Resultados de la búsqueda</h2>
              <p className={styles.resultsCount}>
                {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
              </p>
            </div>

            <div className={styles.resultsList}>
              {results.map((result, index) => (
                <Card key={`${result.document}-${index}`} className={styles.resultCard}>
                  <div className={styles.resultHeader}>
                    <h3 className={styles.documentName}>{result.document}</h3>
                    {result.page && (
                      <span className={styles.pageNumber}>Página {result.page}</span>
                    )}
                    <div className={styles.scoreBadge}>
                      Relevancia: {Math.round(result.score * 100)}%
                    </div>
                  </div>
                  <p className={styles.resultText}>
                    {highlightTerm(result.text, localQuery)}
                  </p>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  <FaArrowLeft />
                  <span>Anterior</span>
                </Button>
                
                <div className={styles.pageInfo}>
                  Página {currentPage} de {totalPages}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  <span>Siguiente</span>
                  <FaArrowRight />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
