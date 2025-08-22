import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL no está definido en las variables de entorno. Usando valor por defecto:', API_BASE_URL);
}

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 300000, // 5 minutos de timeout para respuestas largas
});

// Interceptor para las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.params || '');
    return config;
  },
  (error: unknown) => {
    console.error('[API] Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API] Respuesta recibida de ${response.config.url}:`, response.status);
    return response;
  },
  (error: unknown) => {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const responseData = axiosError.response.data as { message?: string };
      const errorMessage = responseData?.message || 'Error en la solicitud';
      return Promise.reject(new Error(errorMessage));
    } else if ('request' in axiosError) {
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

// Export the API instance
export { api };

export default api;
