/**
 * Servicio para gestionar usuarios (Solo Admin)
 * Para funciones de perfil del usuario autenticado, ver: modules/perfil/services/perfilService.js
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todos los usuarios (Solo Admin)
 * @param {Object} params - Parámetros de consulta (page, page_size, search, is_active, role_id)
 * @returns {Promise} Lista de usuarios
 */
export const getUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.search) queryParams.append('search', params.search);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
    if (params.role_id) queryParams.append('role_id', params.role_id);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `users/?${queryString}` : 'users/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por ID (Solo Admin)
 * @param {string} userId - ID del usuario
 * @returns {Promise} Datos del usuario
 */
export const getUserById = async (userId) => {
  try {
    return await get(`users/${userId}/`);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario (Solo Admin)
 * @param {Object} data - Datos del usuario
 * @returns {Promise} Usuario creado
 */
export const createUser = async (data) => {
  try {
    return await post('users/', data);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario (Solo Admin)
 * @param {string} userId - ID del usuario
 * @param {Object} data - Datos a actualizar
 * @param {boolean} partial - Si es true, usa PATCH; si es false, usa PUT
 * @returns {Promise} Usuario actualizado
 */
export const updateUser = async (userId, data, partial = true) => {
  try {
    if (partial) {
      return await patch(`users/${userId}/`, data);
    } else {
      return await put(`users/${userId}/`, data);
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Elimina un usuario (Solo Admin)
 * @param {string} userId - ID del usuario
 * @returns {Promise} Resultado de la operación
 */
export const deleteUser = async (userId) => {
  try {
    return await del(`users/${userId}/`);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};
