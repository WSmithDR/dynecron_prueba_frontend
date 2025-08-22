import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

import styles from '../pages/QAPage/index.module.css';
import type { AnswerCitation } from '../../store/qa/qa.types';

interface CitationItemProps {
  citation: AnswerCitation;
  index: number;
}

const CitationItem: React.FC<CitationItemProps> = ({ citation, index }) => {
  const pageInfo = citation.page ? `, pág. ${citation.page}` : '';
  const scoreInfo = citation.score ? ` (${(citation.score * 100).toFixed(1)}% relevante)` : '';
  const source = citation.documentName || citation.source;
  
  return (
    <div className={styles.citation}>
      <div className={styles.citationHeader}>
        <span className={styles.citationNumber}>{index + 1}</span>
        <span className={styles.citationSource}>
          {source}{pageInfo}{scoreInfo}
        </span>
      </div>
      <blockquote className={styles.citationText}>
        <FaQuoteLeft className={styles.quoteIcon} />
        {citation.content}
      </blockquote>
      {citation.metadata?.document_id && (
        <div className={styles.citationMeta}>
          <small>ID: {citation.metadata.document_id}</small>
        </div>
      )}
    </div>
  );
};

export default CitationItem;
