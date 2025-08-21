import React from 'react';
import { Card } from 'antd';

import styles from './index.module.css';
import type { SearchResult } from '../../store/search/search.types';

interface SearchResultCardProps {
  result: SearchResult;
  searchTerm: string;
}
const highlightTerm = (text: string, term: string) => {
  if (!term) return text;
  
  const parts = text.split(new RegExp(`(${term})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === term.toLowerCase() 
      ? <mark key={i} className={styles.highlight}>{part}</mark> 
      : part
  );
};

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, searchTerm }) => {
  return (
    <Card 
      className={styles.resultCard}
      hoverable
      bodyStyle={{ padding: '16px' }}
    >
      <div className={styles.resultHeader}>
        <div className={styles.documentInfo}>
          <h3 className={styles.documentName}>
            {result.documentName}
          </h3>
          {result.page && (
            <span className={styles.pageNumber}>
              Página {result.page}
            </span>
          )}
        </div>
        <div className={styles.scoreBadge}>
          <span className={styles.scoreValue}>
            {Math.round(result.relevanceScore * 100)}%
          </span>
          <span className={styles.scoreLabel}>Relevancia</span>
        </div>
      </div>
      
      <div className={styles.resultText}>
        {highlightTerm(result.text, searchTerm)}
      </div>
    </Card>
  );
};

export default SearchResultCard;
