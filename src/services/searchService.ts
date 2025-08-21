import { api } from './api';
import type { SearchResponse } from '../store/search/search.types';

export const searchDocuments = async (
  query: string, 
  page: number = 1, 
  pageSize: number = 10
): Promise<SearchResponse> => {
  try {
    const response = await api.get<SearchResponse>('/search', {
      params: { 
        q: query, 
        page, 
        limit: pageSize 
      }
    });
    
    // Ensure the response matches our SearchResponse type
    
    console.log("searchDocuments", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al buscar documentos:', error);
    // Retornar un objeto vacío en caso de error
    return { results: [], total: 0, page: 0, pageSize: 0, totalPages: 0 };
  }
};

// Función para resaltar términos de búsqueda en el texto
export const highlightSearchTerms = (text: string, query: string): string => {
  if (!query.trim()) return text;
  
  const searchTerms = query
    .split(' ')
    .filter(term => term.length > 0)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  if (searchTerms.length === 0) return text;
  
  const regex = new RegExp(`(${searchTerms.join('|')})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
};
