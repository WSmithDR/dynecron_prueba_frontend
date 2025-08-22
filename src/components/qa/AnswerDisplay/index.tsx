import React from 'react';
import AnswerCard from '../AnswerCard';
import CitationItem from '../CitationItem';
import styles from './index.module.css';

import type { AnswerCitation } from '../../../store/qa/qa.types';

interface AnswerDisplayProps {
  question: string;
  answer: string;
  citations: AnswerCitation[];
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ question, answer, citations }) => {
  return (
    <div className={styles.container}>
      <AnswerCard question={question} answer={answer} />

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
