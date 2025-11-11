/**
 * Servicio de Autenticación
 * Maneja las peticiones de autenticación al backend
 */

import { httpClient } from '../../../services';

/**
 * Realiza el login con credenciales tradicionales
 * @param {Object} credentials - Credenciales de login { email, password }
 * @returns {Promise} Respuesta del servidor
 */
export const login = async (credentials) => {
  const response = await httpClient.post('/auth/login', credentials);
  return response.data ?? response;
};

/**
 * Realiza el registro con credenciales tradicionales
 * @param {Object} userData - Datos del usuario { email, password, ... }
 * @returns {Promise} Respuesta del servidor
 */
export const register = async (userData) => {
  const response = await httpClient.post('/auth/register', userData);
  return response.data ?? response;
};

/**
 * Envía los datos de OAuth al backend para autenticación/registro
 * @param {Object} oauthData - Datos de OAuth {
 *   provider: 'microsoft',
 *   provider_id: string,
 *   email: string,
 *   username: string
 * }
 * @returns {Promise} Respuesta del servidor con token y datos del usuario
 */
export const oauthLogin = async (oauthData) => {
  const response = await httpClient.post('/auth/oauth/', oauthData);
  return response.data ?? response;
};

export default {
  login,
  register,
  oauthLogin,
};
