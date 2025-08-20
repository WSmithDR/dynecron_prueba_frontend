import type { UploaderState } from './uploader.types';

export const initialState: UploaderState = {
  uploadedFiles: [],
  loading: 'idle',
  error: null,
};
