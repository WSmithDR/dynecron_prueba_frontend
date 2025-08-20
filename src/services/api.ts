import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL no está definido en las variables de entorno. Usando valor por defecto:', API_BASE_URL);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const errorMessage = error.response.data?.message || 'Error en la solicitud';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    } else {
      // Algo sucedió al configurar la solicitud
      return Promise.reject(new Error('Error al configurar la solicitud'));
    }
  }
);

// Configuración para subida de archivos
export const uploadConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  onUploadProgress: (progressEvent: ProgressEvent) => {
    // Opcional: Podemos usar esto para mostrar el progreso de la carga
    const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
    console.log(`Progreso de carga: ${progress}%`);
  },
};

export default api;
