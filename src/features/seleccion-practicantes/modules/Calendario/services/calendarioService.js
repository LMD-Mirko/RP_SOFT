/**
 * Servicio para gestionar calendario y reuniones
 * NOTA: Los endpoints aún no están documentados en el backend
 * Esta es una estructura básica que se puede conectar cuando el backend esté listo
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todas las reuniones programadas
 * @param {Object} params - Parámetros de consulta (page, page_size, fecha_inicio, fecha_fin)
 * @returns {Promise} Lista de reuniones
 */
export const getReuniones = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
    if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `meetings/?${queryString}` : 'meetings/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener reuniones:', error);
    throw error;
  }
};

/**
 * Obtiene una reunión por ID
 * @param {string|number} id - ID de la reunión
 * @returns {Promise} Datos de la reunión
 */
export const getReunionById = async (id) => {
  try {
    return await get(`meetings/${id}/`);
  } catch (error) {
    console.error('Error al obtener reunión:', error);
    throw error;
  }
};

/**
 * Crea una nueva reunión
 * @param {Object} data - Datos de la reunión
 * @returns {Promise} Reunión creada
 */
export const createReunion = async (data) => {
  try {
    return await post('meetings/', data);
  } catch (error) {
    console.error('Error al crear reunión:', error);
    throw error;
  }
};

/**
 * Actualiza una reunión
 * @param {string|number} id - ID de la reunión
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Reunión actualizada
 */
export const updateReunion = async (id, data) => {
  try {
    return await patch(`meetings/${id}/`, data);
  } catch (error) {
    console.error('Error al actualizar reunión:', error);
    throw error;
  }
};

/**
 * Elimina una reunión
 * @param {string|number} id - ID de la reunión
 * @returns {Promise} Resultado de la operación
 */
export const deleteReunion = async (id) => {
  try {
    return await del(`meetings/${id}/`);
  } catch (error) {
    console.error('Error al eliminar reunión:', error);
    throw error;
  }
};

