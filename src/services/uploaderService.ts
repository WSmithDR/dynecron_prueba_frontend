import { api } from './api';
import type { AxiosProgressEvent } from 'axios';

export interface UploadResponse {
  success: boolean;
  message: string;
  files: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

export const uploadFiles = async (files: File[]): Promise<UploadResponse> => {
  const formData = new FormData();
  
  // Agregar cada archivo al FormData
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await api({
      method: 'post',
      url: '/ingest',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
        console.log(`Upload progress: ${progress}%`);
      },
    });
    
    return response.data as UploadResponse;
  } catch (error) {
    console.error('Error al subir archivos:', error);
    throw error;
  }
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Validar tipo de archivo
  const validTypes = ['application/pdf', 'text/plain'];
  if (!validTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Solo se permiten archivos PDF y TXT' 
    };
  }

  // Validar tamaño (máximo 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'El archivo es demasiado grande (máx. 10MB)' 
    };
  }

  return { isValid: true };
};
