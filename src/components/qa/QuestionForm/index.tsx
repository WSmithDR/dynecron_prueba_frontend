import React, { useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import styles from './index.module.css';

interface QuestionFormProps {
  question: string;
  loading: boolean;
  onQuestionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onExampleClick: (example: string) => void;
}

const exampleQuestions = [
  '¿Cuál es el resumen del documento?',
  'Menciona los puntos principales',
  'Explica el concepto clave',
  '¿Puedes darme más detalles?'
];

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  loading,
  onQuestionChange,
  onSubmit,
  onExampleClick
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [question]);

  // Handle Shift+Enter for new line, Enter to submit
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  return (
    <div className={styles.chatFormContainer}>
      <div className={styles.examplesContainer}>
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
      
      <form ref={formRef} onSubmit={onSubmit} className={styles.chatForm}>
        <div className={styles.textareaContainer}>
          <textarea
            ref={textareaRef}
            value={question}
            onChange={onQuestionChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta..."
            className={styles.chatInput}
            disabled={loading}
            rows={1}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={loading || !question.trim()}
            aria-label={loading ? 'Enviando...' : 'Enviar mensaje'}
          >
            {loading ? (
              <FaSpinner className={styles.spinner} />
            ) : (
              <FaPaperPlane className={styles.sendIcon} />
            )}
          </button>
        </div>
        <div className={styles.hintText}>
          <span>Shift + Enter para nueva línea • Enter para enviar</span>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
