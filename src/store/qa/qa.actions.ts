import { createAsyncThunk } from "@reduxjs/toolkit";
import { askQuestion } from "../../services/qaService";

export const askQuestionAction = createAsyncThunk(
    'qa/askQuestion',
    async (question: string, { rejectWithValue }) => {
      try {
        const response = await askQuestion(question);
        return response;
      } catch (error) {
        return rejectWithValue('Error al procesar la pregunta');
      }
    }
  );