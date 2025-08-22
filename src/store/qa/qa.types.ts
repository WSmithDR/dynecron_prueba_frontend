import type { LoadingState } from ".."

type DocumentSourceType = 'pdf' | 'web' | 'text' | 'other'

export interface AnswerCitation {
  /** The relevant text from the document (truncated if too long) */
  content: string
  
  /** The title or name of the source document */
  source: string
  
  /** The original source or file name of the document */
  documentName?: string
  
  /** The type of the source document */
  sourceType?: DocumentSourceType
  
  /** Page number in the document, if applicable */
  page?: number
  
  /** Relevancy score of the citation */
  score?: number
  
  /** Additional metadata */
  metadata?: {
    source?: string
    document_id?: string
    chunk_index?: number
  }
}

export interface AskQuestionParams {
  /** The question to be answered */
  question: string
  
  /** Whether to include source citations in the response */
  include_sources?: boolean
  
  /** Maximum number of citations to include (0 for no citations) */
  max_citations?: number
}

export interface QAAnswer {
  /** The generated answer to the question */
  answer: string
  
  /** List of supporting citations, ordered by relevance */
  citations: AnswerCitation[]
  
  /** Whether there was sufficient context to generate a confident answer */
  has_enough_context: boolean
  
  /** Confidence score of the answer (0.0 to 1.0) */
  confidence_score?: number
  
  /** The model used to generate the answer */
  model_used?: string
  
  /** Time taken to process the question in milliseconds */
  processing_time_ms?: number
}

export interface QAState {
  /** The current question being asked */
  question: string
  
  /** The current answer, if any */
  answer: string
  
  /** List of citations supporting the answer */
  citations: AnswerCitation[]
  
  /** Loading state of the QA process */
  loading: LoadingState
  
  /** Any error that occurred during processing */
  error: string | null
  
  /** Confidence score of the current answer (0.0 to 1.0) */
  confidenceScore?: number
  
  /** Whether the answer has sufficient context */
  hasEnoughContext: boolean
}