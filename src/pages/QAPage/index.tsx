import React, { useState, useEffect } from 'react';

import { FaQuestionCircle, FaSpinner, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import styles from './index.module.css';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectAnswer, selectCitations, selectQuestion, selectQALoading, selectQAError, setQuestion, askQuestionAction } from '../../store/qa';


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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuestion.trim()) {
      handleAskQuestion(localQuestion);
    }
  };

  const handleExampleQuestion = (exampleQuestion: string) => {
    setLocalQuestion(exampleQuestion);
    // Don't submit automatically, let the user press enter or click the button
  };

  const renderCitation = (citation: any, index: number) => {
    const citationNumber = index + 1;
    const pageInfo = citation.page ? `, pág. ${citation.page}` : '';
    
    return (
      <div key={index} className={styles.citation}>
        <div className={styles.citationHeader}>
          <span className={styles.citationNumber}>{citationNumber}</span>
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

  return (
    <div className={styles.qaPage}>
      <div className={styles.qaContainer}>
        <h1>Preguntas y Respuestas</h1>
        <p className={styles.subtitle}>
          Haz preguntas en lenguaje natural y obtén respuestas basadas en tus documentos
        </p>

        <form onSubmit={handleSubmit} className={styles.questionForm}>
          <div className={styles.questionInputContainer}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={localQuestion}
                onChange={(e) => setLocalQuestion(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className={styles.questionInput}
                disabled={loading === 'pending'}
              />
              <Button 
                type="submit" 
                variant="primary"
                className={styles.askButton}
                disabled={loading === 'pending' || !localQuestion.trim()}
              >
                {loading === 'pending' ? (
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
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleQuestion("¿Cuál es el resumen del documento?")}
              >
                ¿Cuál es el resumen del documento?
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleQuestion("Menciona los puntos principales")}
              >
                Menciona los puntos principales
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleQuestion("Explica el concepto clave")}
              >
                Explica el concepto clave
              </Button>
            </div>
          </div>
        </form>

        {loading === 'pending' && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinnerContainer}>
              <FaSpinner className={styles.spinnerLarge} />
            </div>
            <p>Analizando tu pregunta...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {hasSearched && loading !== 'pending' && answer && (
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
                    // Add more custom components as needed
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
                  {citations.map((citation, index) => renderCitation(citation, index))}
                </div>
              </div>
            )}
          </div>
        )}

        {hasSearched && loading !== 'pending' && !answer && !error && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <FaQuestionCircle />
            </div>
            <h3>No se pudo generar una respuesta</h3>
            <p>Intenta reformular tu pregunta o verifica que hayas cargado documentos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QAPage;
