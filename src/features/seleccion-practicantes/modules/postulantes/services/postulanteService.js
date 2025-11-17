/**
 * Servicio para gestionar postulantes
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todos los postulantes
 * @param {Object} params - Parámetros de consulta (page, page_size, job_posting_id, state)
 * @returns {Promise} Lista de postulantes
 */
export const getPostulantes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.job_posting_id) queryParams.append('job_posting_id', params.job_posting_id);
    if (params.state) queryParams.append('state', params.state);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `postulants/?${queryString}` : 'postulants/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener postulantes:', error);
    throw error;
  }
};

/**
 * Obtiene un postulante por ID
 * @param {number} id - ID del postulante
 * @returns {Promise} Datos del postulante
 */
export const getPostulanteById = async (id) => {
  try {
    return await get(`postulants/${id}/`);
  } catch (error) {
    console.error('Error al obtener postulante:', error);
    throw error;
  }
};

/**
 * Postularse a una convocatoria
 * @param {Object} data - Datos de la postulación (job_posting_id o convocatoria_id)
 * @returns {Promise} Postulación creada
 */
export const postularse = async (data) => {
  try {
    return await post('postulants/', data);
  } catch (error) {
    console.error('Error al postularse:', error);
    throw error;
  }
};

/**
 * Guarda o actualiza los datos personales del postulante autenticado
 * @param {Object} data - Datos personales
 * @returns {Promise} Datos personales guardados
 */
export const savePersonalData = async (data) => {
  try {
    return await post('postulants/me/personal-data/', data);
  } catch (error) {
    console.error('Error al guardar datos personales:', error);
    throw error;
  }
};

/**
 * Obtiene los datos personales del postulante autenticado
 * @returns {Promise} Datos personales
 */
export const getPersonalData = async () => {
  try {
    return await get('postulants/me/personal-data/');
  } catch (error) {
    console.error('Error al obtener datos personales:', error);
    throw error;
  }
};

/**
 * Acepta un postulante
 * @param {number} id - ID del postulante
 * @returns {Promise} Resultado de la operación
 */
export const aceptarPostulante = async (id) => {
  try {
    return await post(`postulants/${id}/accept`);
  } catch (error) {
    console.error('Error al aceptar postulante:', error);
    throw error;
  }
};

/**
 * Rechaza un postulante
 * @param {number} id - ID del postulante
 * @returns {Promise} Resultado de la operación
 */
export const rechazarPostulante = async (id) => {
  try {
    return await post(`postulants/${id}/reject`);
  } catch (error) {
    console.error('Error al rechazar postulante:', error);
    throw error;
  }
};

