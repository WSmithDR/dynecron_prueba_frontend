import type { QAState } from "./qa.types";

export const initialState: QAState = {
    question: '',
    answer: '',
    citations: [],
    loading: 'idle',
    error: null,
  };