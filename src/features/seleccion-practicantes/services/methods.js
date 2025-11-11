/**
 * Métodos HTTP para el módulo Selección de Practicantes
 * Proporciona funciones helper para realizar peticiones HTTP
 */

import axios from 'axios';
import { BASE_URL } from './baseUrl';
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from '../shared/utils/cookieHelper';

/**
 * Opciones por defecto para las peticiones
 */
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Obtiene el token de autenticación de las cookies
 * @returns {string|null} Token de autenticación o null
 */
const getAuthToken = () => {
  return getAccessToken();
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

// Variable para evitar múltiples refresh simultáneos
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Refresca el token de acceso usando el refresh token
 * @returns {Promise<string>} Nuevo access token
 */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No hay refresh token disponible');
  }

  try {
    const response = await axios.post(
      `${sanitizeBaseUrl(BASE_URL)}/auth/token/refresh/`,
      { refresh: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const newAccessToken = response.data?.access || response.data?.access_token;
    const newRefreshToken = response.data?.refresh || refreshToken;

    if (newAccessToken) {
      setAuthTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    }

    throw new Error('No se recibió un nuevo access token');
  } catch (error) {
    // Si el refresh falla, limpiar tokens y redirigir al login
    clearAuthTokens();
    localStorage.removeItem('rpsoft_user');
    
    // Redirigir al login si estamos en el navegador
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    
    throw error;
  }
};

// Interceptor de request: agrega el token a las peticiones
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

// Interceptor de response: maneja 401 y refresh token
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es una petición de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando, esperar en la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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

