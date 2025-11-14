/**
 * Servicio para gestionar convocatorias
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todas las convocatorias
 * @param {Object} params - Parámetros de consulta (page, page_size, estado)
 * @returns {Promise} Lista de convocatorias
 */
export const getConvocatorias = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.estado) queryParams.append('estado', params.estado);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `convocatorias/?${queryString}` : 'convocatorias/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener convocatorias:', error);
    throw error;
  }
};

/**
 * Obtiene una convocatoria por ID
 * @param {number} id - ID de la convocatoria
 * @returns {Promise} Datos de la convocatoria
 */
export const getConvocatoriaById = async (id) => {
  try {
    return await get(`convocatorias/${id}/`);
  } catch (error) {
    console.error('Error al obtener convocatoria:', error);
    throw error;
  }
};

/**
 * Crea una nueva convocatoria
 * @param {Object} data - Datos de la convocatoria
 * @returns {Promise} Convocatoria creada
 */
export const createConvocatoria = async (data) => {
  try {
    return await post('convocatorias/', data);
  } catch (error) {
    console.error('Error al crear convocatoria:', error);
    throw error;
  }
};

/**
 * Actualiza una convocatoria
 * @param {number} id - ID de la convocatoria
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Convocatoria actualizada
 */
export const updateConvocatoria = async (id, data) => {
  try {
    return await patch(`convocatorias/${id}/`, data);
  } catch (error) {
    console.error('Error al actualizar convocatoria:', error);
    throw error;
  }
};

/**
 * Cierra una convocatoria
 * @param {number} id - ID de la convocatoria
 * @returns {Promise} Resultado de la operación
 */
export const cerrarConvocatoria = async (id) => {
  try {
    return await post(`convocatorias/${id}/cerrar`);
  } catch (error) {
    console.error('Error al cerrar convocatoria:', error);
    throw error;
  }
};

/**
 * Elimina una convocatoria
 * @param {number} id - ID de la convocatoria
 * @returns {Promise} Resultado de la operación
 */
export const deleteConvocatoria = async (id) => {
  try {
    return await del(`convocatorias/${id}/`);
  } catch (error) {
    console.error('Error al eliminar convocatoria:', error);
    throw error;
  }
};

