/**
 * Servicio para el flujo de postulación de practicantes
 */

import { get, post } from '../../../services/methods';
import * as postulanteService from '../../postulantes/services';

/**
 * Obtiene las convocatorias abiertas disponibles
 * @returns {Promise} Lista de convocatorias abiertas
 */
export const getConvocatoriasAbiertas = async () => {
  try {
    return await get('convocatorias/?estado=abierta');
  } catch (error) {
    console.error('Error al obtener convocatorias abiertas:', error);
    throw error;
  }
};

/**
 * Postularse a una convocatoria
 * @param {number} jobPostingId - ID de la convocatoria
 * @returns {Promise} Resultado de la postulación
 */
export const postularseConvocatoria = async (jobPostingId) => {
  try {
    return await postulanteService.postularse({ job_posting_id: jobPostingId });
  } catch (error) {
    console.error('Error al postularse:', error);
    throw error;
  }
};

/**
 * Guarda los datos personales del postulante
 * @param {Object} personalData - Datos personales
 * @returns {Promise} Datos personales guardados
 */
export const guardarDatosPersonales = async (personalData) => {
  try {
    return await postulanteService.savePersonalData(personalData);
  } catch (error) {
    console.error('Error al guardar datos personales:', error);
    throw error;
  }
};

/**
 * Obtiene los datos personales del postulante autenticado
 * @returns {Promise} Datos personales
 */
export const obtenerDatosPersonales = async () => {
  try {
    return await postulanteService.getPersonalData();
  } catch (error) {
    console.error('Error al obtener datos personales:', error);
    throw error;
  }
};

/**
 * Guarda la encuesta de perfil del postulante autenticado
 * @param {Object} surveyData - Datos de la encuesta de perfil
 * @returns {Promise} Resultado de la operación
 */
export const guardarEncuestaPerfil = async (surveyData) => {
  try {
    return await post('postulants/me/survey-responses/profile', surveyData);
  } catch (error) {
    console.error('Error al guardar encuesta de perfil:', error);
    throw error;
  }
};

/**
 * Guarda la encuesta psicológica del postulante autenticado
 * @param {Object} surveyData - Datos de la encuesta psicológica
 * @returns {Promise} Resultado de la operación
 */
export const guardarEncuestaPsicologica = async (surveyData) => {
  try {
    return await post('postulants/me/survey-responses/psychological', surveyData);
  } catch (error) {
    console.error('Error al guardar encuesta psicológica:', error);
    throw error;
  }
};

/**
 * Guarda la encuesta de motivación del postulante autenticado
 * @param {Object} surveyData - Datos de la encuesta de motivación
 * @returns {Promise} Resultado de la operación
 */
export const guardarEncuestaMotivacion = async (surveyData) => {
  try {
    return await post('postulants/me/survey-responses/motivation', surveyData);
  } catch (error) {
    console.error('Error al guardar encuesta de motivación:', error);
    throw error;
  }
};

/**
 * Obtiene el estado del postulante para una convocatoria
 * Incluye el estado de todas las evaluaciones y sus evaluation_id
 * @param {number} jobPostingId - ID de la convocatoria
 * @returns {Promise} Estado del postulante con evaluations_status
 */
export const obtenerEstadoPostulante = async (jobPostingId) => {
  try {
    const response = await get(`postulants/?job_posting_id=${jobPostingId}`);
    // El endpoint devuelve { results: [...] }, tomar el primero
    if (response.results && response.results.length > 0) {
      return response.results[0];
    }
    return null;
  } catch (error) {
    console.error('Error al obtener estado del postulante:', error);
    throw error;
  }
};

