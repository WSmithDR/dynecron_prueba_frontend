import React from 'react';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';
import Button from '../../common/Button';
import styles from './index.module.css';

interface QuestionFormProps {
  question: string;
  loading: boolean;
  onQuestionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onExampleClick: (example: string) => void;
}

const exampleQuestions = [
  '¿Cuál es el resumen del documento?',
  'Menciona los puntos principales',
  'Explica el concepto clave'
];

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  loading,
  onQuestionChange,
  onSubmit,
  onExampleClick
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={question}
            onChange={onQuestionChange}
            placeholder="Escribe tu pregunta aquí..."
            className={styles.input}
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="primary"
            className={styles.button}
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <>
                <FaSpinner className={styles.spinner} />
                <span>Pensando...</span>
              </>
            ) : (
              <>
                <span>Preguntar</span>
                <FaArrowRight style={{ marginLeft: '0.5rem' }} />
              </>
            )}
          </Button>
        </div>
        
        <div className={styles.exampleQuestions}>
          {exampleQuestions.map((example, index) => (
            <button
              key={index}
              type="button"
              className={styles.exampleButton}
              onClick={() => onExampleClick(example)}
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;
