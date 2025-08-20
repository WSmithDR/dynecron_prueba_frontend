import type { LoadingState } from "..";

export interface AnswerCitation {
    text: string;
    document: string;
    page?: number;
  }
  
  export interface QAState {
    question: string;
    answer: string;
    citations: AnswerCitation[];
    loading: LoadingState;
    error: string | null;
  }