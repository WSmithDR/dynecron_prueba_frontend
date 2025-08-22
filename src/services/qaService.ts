import { api } from './api';
import type { AnswerCitation } from '../store/qa/qa.types';

export interface AnswerResponse {
  answer: string;
  citations: AnswerCitation[];
  hasEnoughContext: boolean;
  question?: string;
  confidenceScore?: number;
}

/**
 * Transforms backend citation format to frontend format
 */
const transformCitations = (citations: any[]): AnswerCitation[] => {
  if (!citations || !Array.isArray(citations)) return [];
  
  return citations.map(citation => ({
    content: citation.content || citation.text || '',
    source: citation.source || 'Documento desconocido',
    documentName: citation.documentName || citation.document,
    page: citation.page,
    score: citation.score || citation.relevanceScore,
    metadata: {
      source: citation.source,
      document_id: citation.document_id || citation.metadata?.document_id,
      chunk_index: citation.chunk_index || citation.metadata?.chunk_index
    }
  }));
};

export const askQuestion = async (question: string): Promise<AnswerResponse> => {
  try {
    const response = await api.post('/ask', { question });
    console.log('AskQuestion response:', response.data);
    
    const { answer, citations, hasEnoughContext, confidenceScore } = response.data;
    
    // Transform citations to match our frontend format
    const transformedCitations = transformCitations(citations || []);
    
    // If there's not enough context, return a default response
    if (!hasEnoughContext) {
      return {
        answer: 'No encuentro suficiente información en los documentos cargados para responder a tu pregunta.',
        citations: [],
        hasEnoughContext: false,
        question
      };
    }
    
    return {
      answer,
      citations: transformedCitations,
      hasEnoughContext: true,
      question,
      confidenceScore
    };
  } catch (error) {
    console.error('Error al realizar la pregunta:', error);
    throw error;
  }
};

// Función para formatear las citas en el texto de respuesta
export const formatAnswerWithCitations = (
  answer: string, 
  citations: AnswerCitation[]
): { __html: string } => {
  if (!citations || citations.length === 0) {
    return { __html: answer };
  }

  // Reemplazar marcadores de cita [1], [2], etc. con enlaces a las citas
  let formattedAnswer = answer;
  const citationMap: { [key: string]: AnswerCitation } = {};
  
  // First pass: Replace [1], [2], etc. with superscript links
  citations.forEach((citation, index) => {
    const citationNumber = index + 1;
    const citationId = `citation-${citationNumber}`;
    
    // Map citation number to citation object
    citationMap[citationNumber] = citation;
    
    // Replace [n] with a link to the citation
    const citationPattern = new RegExp(`\\[${citationNumber}\\]`, 'g');
    formattedAnswer = formattedAnswer.replace(
      citationPattern,
      `<sup><a href="#${citationId}" class="citation-link">[${citationNumber}]</a></sup>`
    );
  });
  
  // Second pass: Add citations at the end of the answer
  const citationsHtml = citations.map((citation, index) => {
    const citationNumber = index + 1;
    const citationId = `citation-${citationNumber}`;
    const source = citation.documentName || citation.source || 'Documento sin título';
    const pageInfo = citation.page ? `, pág. ${citation.page}` : '';
    const scoreInfo = citation.score ? ` (${(citation.score * 100).toFixed(0)}% relevante)` : '';
    
    return `
      <div id="${citationId}" class="citation-item">
        <span class="citation-number">[${citationNumber}]</span>
        <div class="citation-content">
          <div class="citation-source">${source}${pageInfo}${scoreInfo}</div>
          <div class="citation-text">${citation.content}</div>
          ${citation.metadata?.document_id ? 
            `<div class="citation-meta">ID: ${citation.metadata.document_id}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Add citations section to the answer
  const formattedHtml = `
    <div class="answer-content">
      ${formattedAnswer}
    </div>
    ${citations.length > 0 ? `
      <div class="citations-section">
        <h4>Fuentes y referencias</h4>
        <div class="citations-list">
          ${citationsHtml}
        </div>
      </div>
    ` : ''}
  `;

  return { __html: formattedHtml };
};
