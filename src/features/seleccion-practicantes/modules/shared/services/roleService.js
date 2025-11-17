/**
 * Servicio para gestionar roles
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todos los roles (Solo Admin)
 * @param {Object} params - Parámetros de consulta
 * @returns {Promise} Lista de roles
 */
export const getRoles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.search) queryParams.append('search', params.search);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `roles/?${queryString}` : 'roles/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    throw error;
  }
};

/**
 * Obtiene un rol por ID (Solo Admin)
 * @param {number} roleId - ID del rol
 * @returns {Promise} Datos del rol
 */
export const getRoleById = async (roleId) => {
  try {
    return await get(`roles/${roleId}/`);
  } catch (error) {
    console.error('Error al obtener rol:', error);
    throw error;
  }
};

/**
 * Crea un nuevo rol (Solo Admin)
 * @param {Object} data - Datos del rol
 * @returns {Promise} Rol creado
 */
export const createRole = async (data) => {
  try {
    return await post('roles/', data);
  } catch (error) {
    console.error('Error al crear rol:', error);
    throw error;
  }
};

/**
 * Actualiza un rol (Solo Admin)
 * @param {number} roleId - ID del rol
 * @param {Object} data - Datos a actualizar
 * @param {boolean} partial - Si es true, usa PATCH; si es false, usa PUT
 * @returns {Promise} Rol actualizado
 */
export const updateRole = async (roleId, data, partial = true) => {
  try {
    if (partial) {
      return await patch(`roles/${roleId}/`, data);
    } else {
      return await put(`roles/${roleId}/`, data);
    }
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    throw error;
  }
};

/**
 * Elimina un rol (Solo Admin)
 * @param {number} roleId - ID del rol
 * @returns {Promise} Resultado de la operación
 */
export const deleteRole = async (roleId) => {
  try {
    return await del(`roles/${roleId}/`);
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    throw error;
  }
};

