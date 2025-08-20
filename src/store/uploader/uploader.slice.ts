import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './uploader.initial-state';
import { uploadFilesAction } from './uploader.actions';

const uploaderSlice = createSlice({
  name: 'uploader',
  initialState,
  reducers: {
    clearUploaderState: (state) => {
      state.uploadedFiles = [];
      state.loading = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFilesAction.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(uploadFilesAction.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        // Access the files array from the response
        state.uploadedFiles = [...state.uploadedFiles, ...action.payload.files];
      })
      .addCase(uploadFilesAction.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearUploaderState } = uploaderSlice.actions;
export default uploaderSlice.reducer;
