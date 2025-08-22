import React, { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  selectAnswer, 
  selectCitations, 
  selectQALoading, 
  selectQAError 
} from '../../store/qa/qa.selectors';
import { setQuestion } from '../../store/qa/qa.slice';
import { askQuestionAction } from '../../store/qa/qa.actions';
import {
  QuestionForm,
  AnswerDisplay,
  LoadingIndicator,
  ErrorDisplay,
  NoResults
} from '../../components/qa';
import styles from './index.module.css';

const QAPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const answer = useAppSelector(selectAnswer);
  const citations = useAppSelector(selectCitations);
  const loading = useAppSelector(selectQALoading);
  const error = useAppSelector(selectQAError);
  const [localQuestion, setLocalQuestion] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleAskQuestion = useCallback(async (questionText: string) => {
    const trimmedQuestion = questionText.trim();
    if (!trimmedQuestion) return;

    try {
      // Update global state
      dispatch(setQuestion(trimmedQuestion));
      console.log("handleAskQuestion", trimmedQuestion);
      // Trigger API call
      await dispatch(askQuestionAction(trimmedQuestion));
      setHasSearched(true);
    } catch (err) {
      console.error('Error asking question:', err);
    }
  }, [dispatch]);

  const handleQuestionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuestion(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(localQuestion);
  }, [localQuestion, handleAskQuestion]);

  const handleExampleQuestion = useCallback((exampleQuestion: string) => {
    setLocalQuestion(exampleQuestion);
  }, []);

  return (
    <div className={styles.qaPage}>
      <div className={styles.qaContainer}>
        <h1>Preguntas y Respuestas</h1>
        <p className={styles.subtitle}>
          Haz preguntas en lenguaje natural y obtén respuestas basadas en tus documentos
        </p>

        <QuestionForm
          question={localQuestion}
          loading={loading === 'pending'}
          onQuestionChange={handleQuestionChange}
          onSubmit={handleSubmit}
          onExampleClick={handleExampleQuestion}
        />

        {loading === 'pending' && <LoadingIndicator />}
        
        {error && <ErrorDisplay error={error} />}
        
        {hasSearched && loading !== 'pending' && answer && (
          <AnswerDisplay
            question={localQuestion}
            answer={answer}
            citations={citations || []}
          />
        )}
        
        {hasSearched && loading !== 'pending' && !answer && !error && <NoResults />}
      </div>
    </div>
  );
};

export default QAPage;
