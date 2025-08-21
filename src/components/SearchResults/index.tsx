import React from 'react';
import { FaRegSadTear } from 'react-icons/fa';
import Card from '../common/Card';
import type { SearchResult } from '../../store/search/search.types';

interface SearchResultsProps {
  results: SearchResult[];
  loading: string | null;
  error: string | null;
  hasSearched: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
}

const highlightTerm = (text: string, term: string) => {
  if (!term) return text;
  
  const regex = new RegExp(`(${term})`, 'gi');
  return text.split(regex).map((part, i) => 
    regex.test(part) ? <mark key={i}>{part}</mark> : part
  );
};

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  hasSearched,
  totalResults,
  currentPage,
  totalPages,
  searchTerm,
  onPageChange
}) => {
  if (loading === 'pending') {
    return (
      <div className="loading-container">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
        <p>Buscando en los documentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (hasSearched && (!results || results.length === 0)) {
    return (
      <div className="no-results">
        <FaRegSadTear className="no-results-icon" />
        <h3>No se encontraron resultados</h3>
        <p>Intenta con otros términos de búsqueda o verifica la ortografía.</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Resultados de la búsqueda</h2>
        <p className="results-count">
          {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="results-list">
        {results.map((result, index) => (
          <Card key={`${result.documentName}-${index}`} className="result-card">
            <div className="result-header">
              <h3 className="document-name">{result.documentName}</h3>
              {result.page && (
                <span className="page-number">Página {result.page}</span>
              )}
              <div className="score-badge">
                Relevancia: {Math.round(result.relevanceScore * 100)}%
              </div>
            </div>
            <p className="result-text">
              {highlightTerm(result.text, searchTerm)}
            </p>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Anterior
          </button>
          
          <div className="page-info">
            Página {currentPage} de {totalPages}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
