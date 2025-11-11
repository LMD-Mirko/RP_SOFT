import { post } from '../../../services/methods';

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

export default {
  login,
  register,
  logout,
  checkEmail,
  passwordResetRequest,
  passwordResetConfirm,
};