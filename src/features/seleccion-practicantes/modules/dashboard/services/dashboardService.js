/**
 * Servicio para obtener estadísticas del dashboard
 */

import { get } from '../../../services/methods';

/**
 * Obtiene estadísticas generales (Solo Admin)
 * @returns {Promise} Estadísticas generales
 */
export const getStats = async () => {
  try {
    return await get('dashboard/stats/');
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de una convocatoria específica (Solo Admin)
 * @param {number} convocatoriaId - ID de la convocatoria
 * @returns {Promise} Estadísticas de la convocatoria
 */
export const getConvocatoriaStats = async (convocatoriaId) => {
  try {
    return await get(`dashboard/convocatorias/${convocatoriaId}/stats/`);
  } catch (error) {
    console.error('Error al obtener estadísticas de convocatoria:', error);
    throw error;
  }
};

/**
 * Obtiene el progreso del postulante autenticado
 * @returns {Promise} Progreso del postulante
 */
export const getMyProgress = async () => {
  try {
    return await get('dashboard/postulants/my-progress/');
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    throw error;
  }
};

/**
 * Obtiene el progreso de un postulante específico (Solo Admin)
 * @param {number} postulantId - ID del postulante
 * @returns {Promise} Progreso del postulante
 */
export const getPostulanteProgress = async (postulantId) => {
  try {
    return await get(`dashboard/postulants/${postulantId}/progress/`);
  } catch (error) {
    console.error('Error al obtener progreso del postulante:', error);
    throw error;
  }
};

/**
 * Obtiene actividad de usuarios (Solo Admin)
 * @param {Object} params - Parámetros de consulta (page, page_size, user_id, action)
 * @returns {Promise} Lista de actividades
 */
export const getUsersActivity = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.user_id) queryParams.append('user_id', params.user_id);
    if (params.action) queryParams.append('action', params.action);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `dashboard/users/activity/?${queryString}` : 'dashboard/users/activity/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener actividad de usuarios:', error);
    throw error;
  }
};

