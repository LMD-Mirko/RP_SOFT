/**
 * Servicio para gestionar practicantes
 * Endpoints: /api/practicantes/
 */

import { get, post, put, patch, del } from '../../../services';

/**
 * Lista todos los practicantes con filtros opcionales
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.nombre - Filtra por nombre
 * @param {string} params.correo - Filtra por correo electrónico
 * @param {string} params.estado - Filtra por estado (activo, en_recuperacion, en_riesgo)
 * @param {number} params.page - Número de página (si el backend soporta paginación)
 * @returns {Promise} Lista de practicantes con paginación
 */
export const getPracticantes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.nombre) queryParams.append('nombre', params.nombre);
    if (params.correo) queryParams.append('correo', params.correo);
    if (params.estado) queryParams.append('estado', params.estado);
    if (params.page) queryParams.append('page', params.page);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `practicantes/?${queryString}` : 'practicantes/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener practicantes:', error);
    throw error;
  }
};

/**
 * Obtiene un practicante por ID
 * @param {number|string} id - ID del practicante
 * @returns {Promise} Datos del practicante
 */
export const getPracticanteById = async (id) => {
  try {
    return await get(`practicantes/${id}/`);
  } catch (error) {
    console.error('Error al obtener practicante:', error);
    throw error;
  }
};

/**
 * Crea un nuevo practicante
 * @param {Object} data - Datos del practicante
 * @param {number} data.id_discord - ID de Discord del practicante
 * @param {string} data.nombre - Nombre del practicante
 * @param {string} data.apellido - Apellido del practicante
 * @param {string} data.correo - Correo electrónico
 * @param {number} data.semestre - Semestre actual
 * @param {string} data.estado - Estado (activo, en_recuperacion, en_riesgo)
 * @returns {Promise} Practicante creado
 */
export const createPracticante = async (data) => {
  try {
    return await post('practicantes/', data);
  } catch (error) {
    console.error('Error al crear practicante:', error);
    throw error;
  }
};

/**
 * Actualiza un practicante (PUT - reemplazo completo)
 * @param {number|string} id - ID del practicante
 * @param {Object} data - Datos completos del practicante
 * @returns {Promise} Practicante actualizado
 */
export const updatePracticante = async (id, data) => {
  try {
    return await put(`practicantes/${id}/`, data);
  } catch (error) {
    console.error('Error al actualizar practicante:', error);
    throw error;
  }
};

/**
 * Actualiza parcialmente un practicante (PATCH - actualización parcial)
 * @param {number|string} id - ID del practicante
 * @param {Object} data - Datos parciales a actualizar
 * @returns {Promise} Practicante actualizado
 */
export const patchPracticante = async (id, data) => {
  try {
    return await patch(`practicantes/${id}/`, data);
  } catch (error) {
    console.error('Error al actualizar practicante:', error);
    throw error;
  }
};

/**
 * Elimina un practicante
 * @param {number|string} id - ID del practicante
 * @returns {Promise} Resultado de la eliminación
 */
export const deletePracticante = async (id) => {
  try {
    return await del(`practicantes/${id}/`);
  } catch (error) {
    console.error('Error al eliminar practicante:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de practicantes
 * @returns {Promise} Estadísticas {
 *   total: number,
 *   activos: number,
 *   en_recuperacion: number,
 *   en_riesgo: number
 * }
 */
export const getEstadisticasPracticantes = async () => {
  try {
    return await get('practicantes/estadisticas/');
  } catch (error) {
    console.error('Error al obtener estadísticas de practicantes:', error);
    throw error;
  }
};

