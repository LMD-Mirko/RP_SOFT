/**
 * Servicio para gestionar calendario y reuniones
 * Basado en MEETINGS_API.md
 */

import { get, post, patch, del } from '../../../services/methods';

/**
 * Lista todas las reuniones programadas (Solo Admin)
 * @param {Object} params - Parámetros de consulta (page, page_size, start_date, end_date, user_id)
 * @returns {Promise} Lista de reuniones
 */
export const getReuniones = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.user_id) queryParams.append('user_id', params.user_id);

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
 * Actualiza una reunión (Solo Admin)
 * @param {string|number} id - ID de la reunión
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Reunión actualizada
 */
export const updateReunion = async (id, data) => {
  try {
    return await patch(`meetings/${id}/update/`, data);
  } catch (error) {
    console.error('Error al actualizar reunión:', error);
    throw error;
  }
};

/**
 * Elimina una reunión (Solo Admin)
 * @param {string|number} id - ID de la reunión
 * @returns {Promise} Resultado de la operación
 */
export const deleteReunion = async (id) => {
  try {
    return await del(`meetings/${id}/delete/`);
  } catch (error) {
    console.error('Error al eliminar reunión:', error);
    throw error;
  }
};

/**
 * Obtiene las reuniones del usuario autenticado
 * @param {Object} params - Parámetros de consulta (page, page_size, start_date, end_date, upcoming)
 * @returns {Promise} Lista de reuniones del usuario
 */
export const getMyMeetings = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.upcoming !== undefined) queryParams.append('upcoming', params.upcoming);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `meetings/my-meetings/?${queryString}` : 'meetings/my-meetings/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener mis reuniones:', error);
    throw error;
  }
};

