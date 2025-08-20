import { LoadingState } from '..';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export interface UploaderState {
  uploadedFiles: UploadedFile[];
  loading: LoadingState;
  error: string | null;
}
