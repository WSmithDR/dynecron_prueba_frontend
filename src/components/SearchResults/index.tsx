import React from 'react';
import type { SearchResult } from '../../store/search/search.types';
import { Typography, Empty, List } from 'antd';
import { SearchResultCard } from '../SearchResultCard';
import styles from './index.module.css';

const { Text } = Typography;

interface SearchResultsProps {
  results: SearchResult[];
  loading: string;
  error: string | null;
  hasSearched: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
}



export const SearchResults: React.FC<SearchResultsProps> = ({
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
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Buscando documentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Text type="danger">Error al buscar documentos: {error}</Text>
      </div>
    );
  }

  if (hasSearched && (!results || results.length === 0)) {
    return (
      <div className={styles.emptyContainer}>
        <Empty 
          description={
            <span>No se encontraron resultados para "{searchTerm}"</span>
          }
        />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          Mostrando <strong>{results.length}</strong> de <strong>{totalResults}</strong> resultados
        </span>
      </div>

      <List
        itemLayout="vertical"
        dataSource={results}
        renderItem={(result) => (
          <List.Item style={{ padding: '16px 0' }}>
            <SearchResultCard 
              result={result} 
              searchTerm={searchTerm} 
            />
          </List.Item>
        )}
      />

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
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
