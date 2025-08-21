import React from 'react';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';
import Button from '../common/Button';
import styles from '../../pages/QAPage/index.module.css';

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
    <form onSubmit={onSubmit} className={styles.questionForm}>
      <div className={styles.questionInputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={question}
            onChange={onQuestionChange}
            placeholder="Escribe tu pregunta aquí..."
            className={styles.questionInput}
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="primary"
            className={styles.askButton}
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
                <FaArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className={styles.exampleQuestions}>
        <p>Ejemplos de preguntas:</p>
        <div className={styles.exampleButtons}>
          {exampleQuestions.map((example, index) => (
            <Button 
              key={index}
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => onExampleClick(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;
