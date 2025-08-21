import { api } from './api';

export interface AnswerCitation {
  text: string;
  document: string;
  page?: number;
}

export interface AnswerResponse {
  answer: string;
  citations: AnswerCitation[];
  hasEnoughContext: boolean;
}

export const askQuestion = async (question: string): Promise<AnswerResponse> => {
  try {
    const response = await api.post<AnswerResponse>('/ask', { question });
    console.log("AskQuestion", response.data);
    // Si no hay suficiente contexto, devolvemos una respuesta por defecto
    if (!response.data.hasEnoughContext) {
      return {
        answer: 'No encuentro suficiente información en los documentos cargados para responder a tu pregunta.',
        citations: [],
        hasEnoughContext: false
      };
    }
    
    return response.data;
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
  
  citations.forEach((citation, index) => {
    const citationNumber = index + 1;
    const citationId = `citation-${citationNumber}`;
    citationMap[citationNumber] = citation;
    
    // Reemplazar [1], [2], etc. con enlaces a las citas
    const regex = new RegExp(`\\[${citationNumber}\\]`, 'g');
    formattedAnswer = formattedAnswer.replace(
      regex, 
      `<a href="#${citationId}" class="citation-link">[${citationNumber}]</a>`
    );
  });

  // Agregar la sección de referencias al final
  const references = citations.map((citation, index) => {
    const citationNumber = index + 1;
    const citationId = `citation-${citationNumber}`;
    const pageInfo = citation.page ? `, pág. ${citation.page}` : '';
    
    return `
      <div id="${citationId}" class="citation">
        <sup>${citationNumber}</sup> ${citation.document}${pageInfo}
        <blockquote>${citation.text}</blockquote>
      </div>
    `;
  }).join('');

  return {
    __html: `
      <div class="answer-content">
        <div class="answer-text">${formattedAnswer}</div>
        ${references.length > 0 ? `
          <div class="citations">
            <h4>Referencias:</h4>
            ${references}
          </div>
        ` : ''}
      </div>
    `
  };
};
