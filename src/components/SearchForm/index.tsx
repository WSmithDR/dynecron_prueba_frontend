import React from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import Button from '../common/Button';
import styles from './index.module.css';

interface SearchFormProps {
  query: string;
  loading: boolean;
  onSearch: (e: React.FormEvent) => void;
  onQueryChange: (query: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  query,
  loading,
  onSearch,
  onQueryChange,
}) => {
  return (
    <form onSubmit={onSearch} className={styles.searchForm}>
      <div className={styles.searchInputContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ingresa tu búsqueda..."
          className={styles.searchInput}
          disabled={loading === true}
        />
        <Button 
          type="submit" 
          variant="primary"
          className={styles.searchButton}
          disabled={loading === true || !query.trim()}
        >
          {loading ? (
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
  );
};

export default SearchForm;
