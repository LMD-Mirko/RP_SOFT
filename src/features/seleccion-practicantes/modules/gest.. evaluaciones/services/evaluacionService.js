/**
 * Servicio para gestionar evaluaciones
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todas las evaluaciones (Solo Admin)
 * @returns {Promise} Lista de evaluaciones
 */
export const getEvaluaciones = async () => {
  try {
    return await get('evaluations');
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    throw error;
  }
};

/**
 * Crea una nueva evaluación (Solo Admin)
 * @param {Object} data - Datos de la evaluación
 * @returns {Promise} Evaluación creada
 */
export const createEvaluacion = async (data) => {
  try {
    return await post('evaluations/', data);
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    throw error;
  }
};

/**
 * Inicia una evaluación automática para una convocatoria (Postulante)
 * @param {number} jobPostingId - ID de la convocatoria
 * @returns {Promise} Información de la evaluación asignada
 */
export const startEvaluation = async (jobPostingId) => {
  try {
    return await post(`convocatorias/${jobPostingId}/start-evaluation/`);
  } catch (error) {
    console.error('Error al iniciar evaluación:', error);
    throw error;
  }
};

/**
 * Inicia un intento de evaluación (Postulante)
 * @param {string} evaluationId - ID de la evaluación
 * @returns {Promise} Información del intento
 */
export const startAttempt = async (evaluationId) => {
  try {
    return await post(`evaluations/${evaluationId}/start/`);
  } catch (error) {
    console.error('Error al iniciar intento:', error);
    throw error;
  }
};

/**
 * Obtiene una evaluación para visualización (Postulante)
 * @param {string} evaluationId - ID de la evaluación
 * @returns {Promise} Datos de la evaluación con preguntas
 */
export const getEvaluacionView = async (evaluationId) => {
  try {
    return await get(`evaluations/${evaluationId}/view/`);
  } catch (error) {
    console.error('Error al obtener evaluación:', error);
    throw error;
  }
};

/**
 * Obtiene el intento activo de una evaluación (Postulante)
 * @param {string} evaluationId - ID de la evaluación
 * @returns {Promise} Datos del intento
 */
export const getActiveAttempt = async (evaluationId) => {
  try {
    return await get(`evaluations/${evaluationId}/attempt/`);
  } catch (error) {
    console.error('Error al obtener intento activo:', error);
    throw error;
  }
};

/**
 * Lista los intentos del postulante autenticado
 * @param {Object} params - Parámetros de consulta (page, page_size)
 * @returns {Promise} Lista de intentos
 */
export const getMyAttempts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `evaluation-attempts/me/?${queryString}` : 'evaluation-attempts/me/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener intentos:', error);
    throw error;
  }
};

/**
 * Guarda una respuesta de evaluación
 * @param {string} attemptId - ID del intento
 * @param {Object} data - Datos de la respuesta (question_id, answer_option_id)
 * @returns {Promise} Resultado de la operación
 */
export const saveAnswer = async (attemptId, data) => {
  try {
    return await post(`evaluation-attempts/${attemptId}/answers/`, data);
  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    throw error;
  }
};

/**
 * Guarda múltiples respuestas de evaluación en lote
 * @param {string} attemptId - ID del intento
 * @param {Object} data - Datos de las respuestas (answers: array)
 * @returns {Promise} Resultado de la operación
 */
export const saveAnswersBatch = async (attemptId, data) => {
  try {
    return await post(`evaluation-attempts/${attemptId}/answers/batch/`, data);
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    throw error;
  }
};

/**
 * Califica un intento de evaluación
 * @param {string} attemptId - ID del intento
 * @returns {Promise} Resultado de la calificación
 */
export const gradeAttempt = async (attemptId) => {
  try {
    return await post(`evaluation-attempts/${attemptId}/grade/`);
  } catch (error) {
    console.error('Error al calificar intento:', error);
    throw error;
  }
};

/**
 * Obtiene una evaluación por ID (Solo Admin)
 * @param {string} evaluationId - ID de la evaluación
 * @returns {Promise} Datos de la evaluación
 */
export const getEvaluacionById = async (evaluationId) => {
  try {
    return await get(`evaluations/${evaluationId}/`);
  } catch (error) {
    console.error('Error al obtener evaluación:', error);
    throw error;
  }
};

/**
 * Actualiza una evaluación (Solo Admin)
 * @param {string} evaluationId - ID de la evaluación
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Evaluación actualizada
 */
export const updateEvaluacion = async (evaluationId, data) => {
  try {
    return await patch(`evaluations/${evaluationId}/`, data);
  } catch (error) {
    console.error('Error al actualizar evaluación:', error);
    throw error;
  }
};

/**
 * Elimina una evaluación (Solo Admin)
 * @param {string} evaluationId - ID de la evaluación
 * @returns {Promise} Resultado de la operación
 */
export const deleteEvaluacion = async (evaluationId) => {
  try {
    return await del(`evaluations/${evaluationId}/`);
  } catch (error) {
    console.error('Error al eliminar evaluación:', error);
    throw error;
  }
};

/**
 * Lista todos los intentos de evaluación (Solo Admin)
 * @param {Object} params - Parámetros de consulta (page, page_size, status, postulant_id)
 * @returns {Promise} Lista de intentos
 */
export const getEvaluationAttempts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.status) queryParams.append('status', params.status);
    if (params.postulant_id) queryParams.append('postulant_id', params.postulant_id);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `evaluation-attempts/?${queryString}` : 'evaluation-attempts/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener intentos de evaluación:', error);
    throw error;
  }
};

/**
 * Elimina un intento de evaluación (Solo Admin)
 * @param {string} attemptId - ID del intento
 * @returns {Promise} Resultado de la operación
 */
export const deleteEvaluationAttempt = async (attemptId) => {
  try {
    return await del(`evaluation-attempts/${attemptId}/`);
  } catch (error) {
    console.error('Error al eliminar intento de evaluación:', error);
    throw error;
  }
};

