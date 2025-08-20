import type { RootState } from "..";
import { sliceName } from "./qa.slice";


export const selectQuestion = (state: RootState) => state[sliceName].question;
export const selectAnswer = (state: RootState) => state[sliceName].answer;
export const selectCitations = (state: RootState) => state[sliceName].citations;
export const selectQALoading = (state: RootState) => state[sliceName].loading;
export const selectQAError = (state: RootState) => state[sliceName].error;