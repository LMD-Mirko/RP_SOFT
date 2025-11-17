/**
 * Servicio para gestionar historial de actividades
 * Endpoints: /api/history/
 * Requiere: Autenticación y rol Admin
 */

import { get, del } from '../../../services/methods';

/**
 * Lista todas las actividades del historial con paginación y filtros
 * @param {Object} params - Parámetros de consulta
 * @param {number} params.page - Número de página (default: 1)
 * @param {number} params.page_size - Tamaño de página (default: 20, máximo: 100)
 * @param {string} params.type - Tipo de acción: 'creacion', 'cambio', 'evaluacion', 'rechazo', 'aceptacion', 'eliminacion', 'login', 'logout'
 * @param {number} params.user_id - ID del usuario que realizó la acción
 * @param {number} params.convocatoria_id - ID de la convocatoria relacionada
 * @param {number} params.postulante_id - ID del postulante relacionado
 * @param {string} params.start_date - Fecha de inicio (formato ISO 8601, ej: 2025-01-01T00:00:00Z)
 * @param {string} params.end_date - Fecha de fin (formato ISO 8601, ej: 2025-12-31T23:59:59Z)
 * @returns {Promise} Lista de actividades con paginación
 */
export const getActividades = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Parámetros de paginación
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    
    // Filtros
    if (params.type) queryParams.append('type', params.type);
    if (params.user_id) queryParams.append('user_id', params.user_id);
    if (params.convocatoria_id) queryParams.append('convocatoria_id', params.convocatoria_id);
    if (params.postulante_id) queryParams.append('postulante_id', params.postulante_id);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    
    // Compatibilidad con nombres antiguos (para migración gradual)
    if (params.tipo && !params.type) queryParams.append('type', params.tipo);
    if (params.fecha_inicio && !params.start_date) queryParams.append('start_date', params.fecha_inicio);
    if (params.fecha_fin && !params.end_date) queryParams.append('end_date', params.fecha_fin);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `history/?${queryString}` : 'history/';
    
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
    return await get(`history/${id}/`);
  } catch (error) {
    console.error('Error al obtener actividad:', error);
    throw error;
  }
};

/**
 * Limpia todo el historial de acciones
 * ⚠️ Esta acción es irreversible
 * @returns {Promise} Respuesta con el número de registros eliminados
 */
export const limpiarHistorial = async () => {
  try {
    return await del('history/clear/');
  } catch (error) {
    console.error('Error al limpiar historial:', error);
    throw error;
  }
};

