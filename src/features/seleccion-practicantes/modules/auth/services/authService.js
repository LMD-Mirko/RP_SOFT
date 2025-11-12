import { post, get } from '../../../services/methods';

/**
 * Servicio de Autenticación
 * Maneja las peticiones de autenticación al backend
 */

/**
 * Realiza el login con credenciales tradicionales
 * @param {Object} credentials - Credenciales de login { email, password }
 * @returns {Promise} Respuesta del servidor
 */
export const login = async (credentials) => {
  try {
    const response = await post('auth/login/', credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Realiza el registro con credenciales tradicionales
 * @param {Object} userData - Datos del usuario { email, username, password, first_name, last_name }
 * @returns {Promise} Respuesta del servidor
 */
export const register = async (userData) => {
  try {
    const response = await post('auth/register/', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Realiza el logout del usuario
 * @param {string} refreshToken - Token de refresh para invalidar en el servidor
 * @returns {Promise} Respuesta del servidor
 */
export const logout = async (refreshToken) => {
  try {
    const response = await post('auth/logout/', { refresh: refreshToken });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Verifica si el email existe en el sistema
 * @param {string} email - Email a verificar
 * @returns {Promise} Respuesta del servidor
 */
export const checkEmail = async (email) => {
  try {
    const response = await post('auth/check-email/', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Solicita el reset de contraseña enviando código al email
 * @param {string} email - Email del usuario
 * @returns {Promise} Respuesta del servidor
 */
export const passwordResetRequest = async (email) => {
  try {
    const response = await post('auth/password-reset-request/', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Confirma el reset de contraseña con código y nueva contraseña
 * @param {Object} data - { email, code, new_password }
 * @returns {Promise} Respuesta del servidor
 */
export const passwordResetConfirm = async (data) => {
  try {
    const response = await post('auth/password-reset-confirm/', data);
    return response;
  } catch (error) {
    throw error;
  }
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

  try {
    const response = await post('auth/oauth/', oauthData);
    return response;
  } catch (error) {
    throw error;
  }
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
  try {
    const response = await get('users/me/role/');
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  checkEmail,
  passwordResetRequest,
  passwordResetConfirm,
  oauthLogin,
  getUserRole,
};