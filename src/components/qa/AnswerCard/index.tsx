import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Card from '../../common/Card';
import styles from './index.module.css';

interface AnswerCardProps {
  question: string;
  answer: string;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ question, answer }) => {
  return (
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
  );
};

export default AnswerCard;
