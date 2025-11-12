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
 *   provider: 'microsoft' | 'google',
 *   provider_id: string,
 *   email: string,
 *   username: string,
 *   name: string,
 *   paternal_lastname: string,
 *   maternal_lastname: string
 * }
 * @returns {Promise} Respuesta del servidor con token y datos del usuario
 */
export const oauthLogin = async (oauthData) => {
  // Validar que todos los campos requeridos estén presentes
  const requiredFields = ['provider', 'provider_id', 'email', 'username'];
  const missingFields = requiredFields.filter(field => !oauthData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
  }

  const response = await httpClient.post('/auth/oauth/', oauthData);
  return response.data ?? response;
};

/**
 * Obtiene el rol del usuario autenticado
 * @returns {Promise<Object>} Datos del rol del usuario {
 *   email: string,
 *   full_name: string | null,
 *   role_id: number,
 *   role_name: string,
 *   role_slug: string,
 *   is_admin: boolean,
 *   is_postulante: boolean
 * }
 */
export const getUserRole = async () => {
  const response = await httpClient.get('/users/me/role/');
  return response.data ?? response;
};

export default {
  login,
  register,
  oauthLogin,
  getUserRole,
};
