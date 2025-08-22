import React from 'react';
import { FaQuestionCircle, FaQuoteLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Card from '../common/Card';
import styles from '../../pages/QAPage/index.module.css';

import type { AnswerCitation } from '../../store/qa/qa.types';

interface AnswerDisplayProps {
  question: string;
  answer: string;
  citations: AnswerCitation[];
}

const CitationItem: React.FC<{ citation: AnswerCitation; index: number }> = ({ citation, index }) => {
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

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ question, answer, citations }) => {
  return (
    <div className={styles.resultsContainer}>
      <Card className={styles.answerCard}>
        <div className={styles.answerHeader}>
          <FaQuestionCircle className={styles.questionIcon} />
          <h3>{question}</h3>
        </div>
        
        <div className={styles.answerContent}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({node, ...props}) => (
                <a {...props} className={styles.markdownLink} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </Card>

      {citations && citations.length > 0 && (
        <div className={styles.citationsSection}>
          <h3 className={styles.citationsTitle}>Fuentes y referencias</h3>
          <div className={styles.citationsList}>
            {citations.map((citation, index) => (
              <CitationItem key={index} citation={citation} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerDisplay;
