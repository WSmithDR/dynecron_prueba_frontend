import React from 'react';
import { FaQuestionCircle, FaQuoteLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Card from '../common/Card';
import styles from '../../pages/QAPage/index.module.css';

interface Citation {
  document: string;
  page?: number;
  text: string;
}

interface AnswerDisplayProps {
  question: string;
  answer: string;
  citations: Citation[];
}

const CitationItem: React.FC<{ citation: Citation; index: number }> = ({ citation, index }) => {
  const pageInfo = citation.page ? `, pág. ${citation.page}` : '';
  
  return (
    <div className={styles.citation}>
      <div className={styles.citationHeader}>
        <span className={styles.citationNumber}>{index + 1}</span>
        <span className={styles.citationSource}>
          {citation.document}{pageInfo}
        </span>
      </div>
      <blockquote className={styles.citationText}>
        <FaQuoteLeft className={styles.quoteIcon} />
        {citation.text}
      </blockquote>
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
