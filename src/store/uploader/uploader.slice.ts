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
        // Map the documents array to match the expected format
        const uploadedFiles = action.payload.documents.map(doc => ({
          name: doc.filename,
          size: 0, // Size is not provided in the backend response
          type: doc.filename.split('.').pop() || '' // Infer type from filename
        }));
        state.uploadedFiles = [...state.uploadedFiles, ...uploadedFiles];
      })
      .addCase(uploadFilesAction.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string || 'Error desconocido al subir archivos';
        
        // Log the error for debugging
        if (process.env.NODE_ENV !== 'production') {
          console.error('Upload failed:', action.error);
        }
      });
  },
});

export const { clearUploaderState } = uploaderSlice.actions;
export default uploaderSlice.reducer;
