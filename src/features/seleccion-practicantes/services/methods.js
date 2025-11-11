/**
 * Métodos HTTP para el módulo Selección de Practicantes
 * Proporciona funciones helper para realizar peticiones HTTP
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
 * Obtiene el token de autenticación del localStorage o sessionStorage
 * @returns {string|null} Token de autenticación o null
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
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

httpClient.interceptors.request.use((config) => {
  config.headers = {
    ...defaultOptions.headers,
    ...config.headers,
  };

  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers?.Authorization;
  }

  return config;
});

const normalizeEndpoint = (endpoint) =>
  endpoint ? (endpoint.startsWith('/') ? endpoint : `/${endpoint}`) : '/';

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
      const message =
        error.response.data?.message ||
        error.response.data?.detail ||
        `Error HTTP: ${error.response.status}`;
      throw new Error(message);
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

