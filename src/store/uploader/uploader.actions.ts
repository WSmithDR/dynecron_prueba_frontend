import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadFiles } from '../../services/uploaderService';
import type { UploadResponse } from './uploader.types';

export const uploadFilesAction = createAsyncThunk<
  UploadResponse,  // Now expecting full UploadResponse
  File[],
  { rejectValue: string }
>('uploader/uploadFiles', async (files, { rejectWithValue }) => {
  try {
    const response = await uploadFiles(files);
    return response;  // Return the full response
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Error al subir los archivos'
    );
  }
});

export const clearUploaderState = () => ({
  type: 'uploader/clearUploaderState',
});
