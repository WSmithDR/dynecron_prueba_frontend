import { LoadingState } from '..';

export interface UploadedDocument {
  filename: string;
  id: string;
  status: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export interface UploadResponse {
  documents: UploadedDocument[];
  errors: Array<{ filename: string; error: string }>;
}

export interface UploaderState {
  uploadedFiles: UploadedFile[];
  loading: LoadingState;
  error: string | null;
}
