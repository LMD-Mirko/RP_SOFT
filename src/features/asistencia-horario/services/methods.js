/**
 * Métodos HTTP para el módulo Asistencia y Horario
 * Proporciona funciones helper para realizar peticiones HTTP básicas
 * Sin manejo de autenticación - el backend es libre
 */

import axios from 'axios';
import { BASE_URL } from './baseUrl';

/**
 * Opciones por defecto para las peticiones
 */
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Instancia de Axios configurada para el módulo
 */
const sanitizeBaseUrl = (url) => (url.endsWith('/') ? url.slice(0, -1) : url);

const httpClient = axios.create({
  baseURL: sanitizeBaseUrl(BASE_URL),
  headers: {
    ...defaultOptions.headers,
  },
});

/**
 * Normaliza el endpoint asegurando formato correcto
 * @param {string} endpoint - Endpoint a normalizar
 * @returns {string} Endpoint normalizado
 */
const normalizeEndpoint = (endpoint) => {
  if (!endpoint) return '/';
  
  // Separar el endpoint de los query params
  const [path, queryString] = endpoint.split('?');
  
  // Normalizar el path
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Asegurar que el path termine con / (excepto si es solo /)
  if (normalizedPath !== '/' && !normalizedPath.endsWith('/')) {
    normalizedPath = `${normalizedPath}/`;
  }
  
  // Reconstruir con query params si existen
  return queryString ? `${normalizedPath}?${queryString}` : normalizedPath;
};

/**
 * Traduce mensajes de error comunes del inglés al español
 * @param {string} message - Mensaje de error original
 * @param {number} status - Código de estado HTTP
 * @returns {string} Mensaje traducido
 */
const translateErrorMessage = (message, status) => {
  if (!message) return message;
  
  const lowerMessage = message.toLowerCase();
  
  // Traducir mensajes de permisos (403)
  if (status === 403) {
    if (lowerMessage.includes('you do not have permission') || 
        lowerMessage.includes('permission denied') ||
        lowerMessage.includes('forbidden')) {
      return 'No tienes permisos para realizar esta acción';
    }
    if (lowerMessage.includes('access denied')) {
      return 'Acceso denegado';
    }
  }
  
  // Traducir otros mensajes comunes
  if (lowerMessage.includes('not found') || lowerMessage.includes('does not exist')) {
    return 'Recurso no encontrado';
  }
  
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('authentication')) {
    return 'No estás autenticado. Por favor, inicia sesión';
  }
  
  if (lowerMessage.includes('bad request') || lowerMessage.includes('invalid')) {
    return 'Solicitud inválida';
  }
  
  if (lowerMessage.includes('server error') || lowerMessage.includes('internal error')) {
    return 'Error del servidor. Por favor, intenta más tarde';
  }
  
  // Si no hay traducción específica, devolver el mensaje original
  return message;
};

/**
 * Ejecuta una petición HTTP
 * @param {string} method - Método HTTP (GET, POST, PUT, PATCH, DELETE)
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar en el body (opcional)
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise} Datos de la respuesta
 */
const executeRequest = async (method, endpoint, data, options = {}) => {
  try {
    const response = await httpClient.request({
      url: normalizeEndpoint(endpoint),
      method,
      data,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Preservar el código de error si existe
      const errorCode = error.response.data?.code;
      const status = error.response.status;
      const rawMessage =
        error.response.data?.message ||
        error.response.data?.detail ||
        `Error HTTP: ${status}`;
      
      // Traducir el mensaje de error al español
      const translatedMessage = translateErrorMessage(rawMessage, status);
      
      const customError = new Error(translatedMessage);
      if (errorCode) {
        customError.code = errorCode;
      }
      customError.status = status;
      customError.response = error.response;
      throw customError;
    }

    if (error.request) {
      throw new Error('No se recibió respuesta del servidor. Verifica tu conexión.');
    }

    throw new Error(error.message || 'Error al realizar la petición');
  }
};

/**
 * Realiza una petición GET
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise} Datos de la respuesta
 */
export const get = async (endpoint, options = {}) => {
  return executeRequest('GET', endpoint, undefined, options);
};

/**
 * Realiza una petición POST
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise} Datos de la respuesta
 */
export const post = async (endpoint, data = null, options = {}) => {
  return executeRequest('POST', endpoint, data, options);
};

/**
 * Realiza una petición PUT
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise} Datos de la respuesta
 */
export const put = async (endpoint, data = null, options = {}) => {
  return executeRequest('PUT', endpoint, data, options);
};

/**
 * Realiza una petición PATCH
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise} Datos de la respuesta
 */
export const patch = async (endpoint, data = null, options = {}) => {
  return executeRequest('PATCH', endpoint, data, options);
};

/**
 * Realiza una petición DELETE
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise} Datos de la respuesta
 */
export const del = async (endpoint, options = {}) => {
  return executeRequest('DELETE', endpoint, undefined, options);
};

/**
 * Realiza una petición con método personalizado
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE, etc.)
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar en el body (opcional)
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise} Datos de la respuesta
 */
export const request = async (method, endpoint, data = null, options = {}) => {
  return executeRequest(method.toUpperCase(), endpoint, data, options);
};

// Exportar todos los métodos como objeto también
export default {
  get,
  post,
  put,
  patch,
  delete: del,
  request,
};

export { httpClient };
