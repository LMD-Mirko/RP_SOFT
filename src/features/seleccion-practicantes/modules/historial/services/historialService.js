/**
 * Servicio para gestionar historial de actividades
 * NOTA: Los endpoints aún no están documentados en el backend
 * Esta es una estructura básica que se puede conectar cuando el backend esté listo
 */

import { get } from '../../../services/methods';

/**
 * Lista todas las actividades del historial
 * @param {Object} params - Parámetros de consulta (page, page_size, tipo, fecha_inicio, fecha_fin)
 * @returns {Promise} Lista de actividades
 */
export const getActividades = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.tipo) queryParams.append('tipo', params.tipo);
    if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
    if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `activities/?${queryString}` : 'activities/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    throw error;
  }
};

/**
 * Obtiene una actividad por ID
 * @param {string|number} id - ID de la actividad
 * @returns {Promise} Datos de la actividad
 */
export const getActividadById = async (id) => {
  try {
    return await get(`activities/${id}/`);
  } catch (error) {
    console.error('Error al obtener actividad:', error);
    throw error;
  }
};

/**
 * Exporta el historial a CSV
 * @param {Object} params - Parámetros de filtro
 * @returns {Promise} Datos para exportar
 */
export const exportarHistorial = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.tipo) queryParams.append('tipo', params.tipo);
    if (params.fecha_inicio) queryParams.append('fecha_inicio', params.fecha_inicio);
    if (params.fecha_fin) queryParams.append('fecha_fin', params.fecha_fin);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `activities/export/?${queryString}` : 'activities/export/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al exportar historial:', error);
    throw error;
  }
};

