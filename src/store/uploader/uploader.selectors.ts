import type { RootState } from '..';
import type { UploaderState } from './uploader.types';

const selectUploaderState = (state: RootState): UploaderState => state.uploader;

export const selectUploadedFiles = (state: RootState) =>
  selectUploaderState(state).uploadedFiles;

export const selectUploaderLoading = (state: RootState) =>
  selectUploaderState(state).loading;

export const selectUploaderError = (state: RootState) =>
  selectUploaderState(state).error;
