import { api } from './api';
import type { AxiosProgressEvent, AxiosError } from 'axios';
import type { UploadResponse } from '../store/uploader/uploader.types';

// Types
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  upload_date: string;
  content_type: string;
  num_characters: number;
  path: string;
}

interface DeleteAllResponse {
  success: boolean;
  message: string;
  deleted_files: string[];
  total_deleted: number;
}

interface DeleteFileResponse {
  success: boolean;
  message: string;
}

interface BackendFile {
  archivo: string;
  ruta: string;
  tamano_bytes: number;
  tipo: string;
}

interface BackendError {
  archivo: string;
  error: string;
}

interface BackendResponse {
  archivos_procesados: BackendFile[];
  errores: BackendError[];
  total_procesados: number;
  total_errores: number;
}

// Constants
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const UPLOAD_TIMEOUT = 1800000; // 30 minutes
const MAX_SINGLE_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_FILE_TYPES = ['application/pdf', 'text/plain'];

// File validation
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (!VALID_FILE_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Tipo de archivo no válido. Solo se permiten archivos PDF y TXT.' 
    };
  }

  if (file.size > MAX_SINGLE_FILE_SIZE) {
    return { 
      isValid: false, 
      error: 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.' 
    };
  }

  return { isValid: true };
};

// File upload with progress tracking
export const uploadFiles = async (
  files: File[], 
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  
  // Validate file sizes and types
  const validationResults = files.map(file => ({
    file,
    validation: validateFile(file)
  }));

  const invalidFiles = validationResults.filter(({ validation }) => !validation.isValid);
  
  if (invalidFiles.length > 0) {
    return {
      documents: [],
      errors: invalidFiles.map(({ file, validation }) => ({
        filename: file.name,
        error: validation.error || 'Archivo no válido'
      }))
    };
  }
  
  // Add files to FormData
  files.forEach(file => formData.append('files', file));

  try {
    const response = await api<BackendResponse>({
      method: 'post',
      url: '/ingest',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Request-Timeout': String(UPLOAD_TIMEOUT),
      },
      timeout: UPLOAD_TIMEOUT,
      maxBodyLength: MAX_FILE_SIZE,
      maxContentLength: MAX_FILE_SIZE,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      },
    });
    
    const { archivos_procesados, errores } = response.data;
    
    return {
      documents: archivos_procesados.map(archivo => ({
        filename: archivo.archivo,
        id: archivo.ruta,
        status: 'uploaded',
        size: archivo.tamano_bytes,
        type: archivo.tipo || archivo.archivo.split('.').pop() || ''
      })),
      errors: errores.map(error => ({
        filename: error.archivo || 'Archivo desconocido',
        error: error.error || 'Error desconocido'
      }))
    };
  } catch (error: unknown) {
    console.error('Error al subir archivos:', error);
    
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const message = (axiosError.response.data as { message?: string })?.message || axiosError.response.statusText;
      throw new Error(`Error del servidor: ${message}`);
    } else if (axiosError.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      throw new Error('No se recibió respuesta del servidor. Por favor, verifica tu conexión.');
    } else if ((error as { code?: string }).code === 'ECONNABORTED') {
      // Timeout
      throw new Error('La solicitud tardó demasiado tiempo. Por favor, verifica tu conexión o intenta con archivos más pequeños.');
    } else {
      // Error inesperado
      throw new Error(`Error al subir archivos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
};

// Get list of uploaded files
export const getUploadedFiles = async (): Promise<UploadedFile[]> => {
  try {
    const response = await api.get<UploadedFile[]>('/ingest/files');
    return response.data;
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    throw error;
  }
};

// Delete a single file
export const deleteFile = async (fileId: string): Promise<DeleteFileResponse> => {
  try {
    const response = await api.delete<DeleteFileResponse>(`/ingest/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    throw error;
  }
};

// Delete all files
export const deleteAllFiles = async (): Promise<DeleteAllResponse> => {
  try {
    const response = await api.delete<DeleteAllResponse>('/ingest/files', { 
      params: { confirm: true } 
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting all files:', error);
    throw error;
  }
};

// Export all functions as default object for backward compatibility
const uploaderService = {
  uploadFiles,
  getUploadedFiles,
  deleteFile,
  deleteAllFiles,
  validateFile
};

export default uploaderService;
