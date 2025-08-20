import { createSlice } from '@reduxjs/toolkit';
import { askQuestionAction } from './qa.actions';
import { initialState } from './qa.initial-state';

export const sliceName = "qa"

const qaSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setQuestion: (state, action) => {
      state.question = action.payload;
    },
    clearQA: (state) => {
      state.question = '';
      state.answer = '';
      state.citations = [];
      state.loading = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askQuestionAction.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(askQuestionAction.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.answer = action.payload.answer;
        state.citations = action.payload.citations || [];
      })
      .addCase(askQuestionAction.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setQuestion, clearQA } = qaSlice.actions;

const qaReducer = qaSlice.reducer;
export default qaReducer; 
