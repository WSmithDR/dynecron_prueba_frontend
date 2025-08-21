import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  selectAnswer, 
  selectCitations, 
  selectQuestion, 
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
  const question = useAppSelector(selectQuestion);
  const answer = useAppSelector(selectAnswer);
  const citations = useAppSelector(selectCitations);
  const loading = useAppSelector(selectQALoading);
  const error = useAppSelector(selectQAError);
  const [localQuestion, setLocalQuestion] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Load question from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const questionParam = params.get('q');
    
    if (questionParam) {
      setLocalQuestion(questionParam);
      dispatch(setQuestion(questionParam));
      handleAskQuestion(questionParam);
    }

    return () => {
      // Clean up if needed
    };
  }, [dispatch]);

  const handleAskQuestion = async (questionText: string) => {
    if (!questionText.trim()) {
      return;
    }

    try {
      await dispatch(askQuestionAction(questionText));
      
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set('q', questionText);
      window.history.pushState({}, '', url.toString());
      
      setHasSearched(true);
    } catch (err) {
      console.error('Error asking question:', err);
    }
  };

  const handleQuestionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuestion(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (localQuestion.trim()) {
      handleAskQuestion(localQuestion);
    }
  }, [localQuestion]);

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
            question={question || ''}
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
