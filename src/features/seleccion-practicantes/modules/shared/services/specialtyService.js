/**
 * Servicio para gestionar especialidades
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todas las especialidades
 * @param {Object} params - Parámetros de consulta
 * @returns {Promise} Lista de especialidades
 */
export const getSpecialties = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.search) queryParams.append('search', params.search);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
    if (params.include_inactive !== undefined) queryParams.append('include_inactive', params.include_inactive);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `specialties/?${queryString}` : 'specialties/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    throw error;
  }
};

/**
 * Obtiene una especialidad por ID
 * @param {number} specialtyId - ID de la especialidad
 * @returns {Promise} Datos de la especialidad
 */
export const getSpecialtyById = async (specialtyId) => {
  try {
    return await get(`specialties/${specialtyId}/`);
  } catch (error) {
    console.error('Error al obtener especialidad:', error);
    throw error;
  }
};

/**
 * Crea una nueva especialidad (Solo Admin)
 * @param {Object} data - Datos de la especialidad
 * @returns {Promise} Especialidad creada
 */
export const createSpecialty = async (data) => {
  try {
    return await post('specialties/', data);
  } catch (error) {
    console.error('Error al crear especialidad:', error);
    throw error;
  }
};

/**
 * Actualiza una especialidad (Solo Admin)
 * @param {number} specialtyId - ID de la especialidad
 * @param {Object} data - Datos a actualizar
 * @param {boolean} partial - Si es true, usa PATCH; si es false, usa PUT
 * @returns {Promise} Especialidad actualizada
 */
export const updateSpecialty = async (specialtyId, data, partial = true) => {
  try {
    if (partial) {
      return await patch(`specialties/${specialtyId}/`, data);
    } else {
      return await put(`specialties/${specialtyId}/`, data);
    }
  } catch (error) {
    console.error('Error al actualizar especialidad:', error);
    throw error;
  }
};

/**
 * Elimina una especialidad (Solo Admin)
 * @param {number} specialtyId - ID de la especialidad
 * @returns {Promise} Resultado de la operación
 */
export const deleteSpecialty = async (specialtyId) => {
  try {
    return await del(`specialties/${specialtyId}/`);
  } catch (error) {
    console.error('Error al eliminar especialidad:', error);
    throw error;
  }
};
