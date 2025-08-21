import { api } from './api';
import type { AxiosProgressEvent } from 'axios';
import type { UploadResponse } from '../store/uploader/uploader.types';

// Configuración para archivos grandes
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

export const uploadFiles = async (files: File[], onProgress?: (progress: number) => void): Promise<UploadResponse> => {
  const formData = new FormData();
  
  // Validar tamaño de archivos
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return {
        documents: [],
        errors: [{
          filename: file.name,
          error: `El archivo excede el tamaño máximo permitido de 1GB`
        }]
      };
    }
  }
  
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
        // Aumentar el tiempo de espera para archivos grandes (30 minutos)
        'X-Request-Timeout': '1800000',
      },
      timeout: 1800000, // 30 minutos de timeout
      maxBodyLength: MAX_FILE_SIZE,
      maxContentLength: MAX_FILE_SIZE,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Progreso de carga: ${progress}%`);
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
    });
    
    // Mapear la respuesta del backend al formato esperado
    const backendResponse = response.data as {
      archivos_procesados: Array<{
        archivo: string;          // nombre del archivo
        ruta: string;            // ruta donde se guardó
        tamano_bytes: number;    // tamaño en bytes
        tipo: string;            // tipo MIME
      }>;
      errores: Array<{
        archivo: string;         // nombre del archivo con error
        error: string;           // mensaje de error
      }>;
      total_procesados: number;
      total_errores: number;
    };
    
    return {
      documents: backendResponse.archivos_procesados.map(archivo => ({
        filename: archivo.archivo,
        id: archivo.ruta,  // Usando la ruta como ID único
        status: 'uploaded',
        size: archivo.tamano_bytes,
        type: archivo.tipo || archivo.archivo.split('.').pop() || ''
      })),
      errors: backendResponse.errores.map(error => ({
        filename: error.archivo || 'Archivo desconocido',
        error: error.error || 'Error desconocido'
      }))
    } as UploadResponse;
  } catch (error: any) {
    console.error('Error al subir archivos:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const message = error.response.data?.message || error.response.statusText;
      throw new Error(`Error del servidor: ${message}`);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      throw new Error('No se recibió respuesta del servidor. Por favor, verifica tu conexión.');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      throw new Error('La solicitud tardó demasiado tiempo. Por favor, verifica tu conexión o intenta con archivos más pequeños.');
    } else {
      // Error inesperado
      throw new Error(`Error al subir archivos: ${error.message}`);
    }
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
