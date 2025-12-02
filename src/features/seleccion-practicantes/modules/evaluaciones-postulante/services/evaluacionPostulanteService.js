/**
 * Servicio para gestionar evaluaciones desde la perspectiva del postulante
 */

import { get, post } from '../../../services/methods'

/**
 * Obtiene las convocatorias disponibles para postulantes
 * @param {Object} params - Parámetros de consulta (page, page_size, search)
 * @returns {Promise} Lista de convocatorias disponibles
 */
export const getConvocatoriasDisponibles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.page_size) queryParams.append('page_size', params.page_size)
    if (params.search) queryParams.append('search', params.search)

    const queryString = queryParams.toString()
    const endpoint = queryString
      ? `convocatorias/available/?${queryString}`
      : 'convocatorias/available/'

    return await get(endpoint)
  } catch (error) {
    console.error('Error al obtener convocatorias disponibles:', error)
    throw error
  }
}

/**
 * Inicia una evaluación automática para una convocatoria
 * @param {number} jobPostingId - ID de la convocatoria
 * @returns {Promise} Información de la evaluación iniciada
 */
export const iniciarEvaluacionConvocatoria = async (jobPostingId) => {
  try {
    return await post(`convocatorias/${jobPostingId}/start-evaluation/`)
  } catch (error) {
    console.error('Error al iniciar evaluación:', error)
    throw error
  }
}

/**
 * Inicia un intento de evaluación
 * @param {string} evaluationId - ID de la evaluación
 * @returns {Promise} Información del intento
 */
export const iniciarIntento = async (evaluationId) => {
  try {
    return await post(`evaluations/${evaluationId}/start/`)
  } catch (error) {
    console.error('Error al iniciar intento:', error)
    throw error
  }
}

/**
 * Obtiene una evaluación para visualización (sin respuestas correctas)
 * @param {string} evaluationId - ID de la evaluación
 * @returns {Promise} Datos de la evaluación con preguntas
 */
export const obtenerEvaluacionView = async (evaluationId) => {
  try {
    return await get(`evaluations/${evaluationId}/view/`)
  } catch (error) {
    console.error('Error al obtener evaluación:', error)
    throw error
  }
}

/**
 * Obtiene el intento activo de una evaluación
 * @param {string} evaluationId - ID de la evaluación
 * @returns {Promise} Datos del intento activo
 */
export const obtenerIntentoActivo = async (evaluationId) => {
  try {
    return await get(`evaluations/${evaluationId}/attempt/`)
  } catch (error) {
    console.error('Error al obtener intento activo:', error)
    throw error
  }
}

/**
 * Guarda una respuesta de evaluación
 * @param {string} attemptId - ID del intento
 * @param {Object} data - Datos de la respuesta (question_id, answer_option_id, text_answer)
 * @returns {Promise} Resultado de la operación
 */
export const guardarRespuesta = async (attemptId, data) => {
  try {
    return await post(`evaluation-attempts/${attemptId}/answers/`, data)
  } catch (error) {
    console.error('Error al guardar respuesta:', error)
    throw error
  }
}

/**
 * Guarda múltiples respuestas en lote
 * @param {string} attemptId - ID del intento
 * @param {Object} data - Datos de las respuestas (answers: array)
 * @returns {Promise} Resultado de la operación
 */
export const guardarRespuestasBatch = async (attemptId, data) => {
  try {
    return await post(`evaluation-attempts/${attemptId}/answers/batch/`, data)
  } catch (error) {
    console.error('Error al guardar respuestas en lote:', error)
    throw error
  }
}

/**
 * Califica un intento de evaluación
 * @param {string} attemptId - ID del intento
 * @returns {Promise} Resultado de la calificación
 */
export const calificarIntento = async (attemptId) => {
  try {
    return await post(`evaluation-attempts/${attemptId}/grade/`)
  } catch (error) {
    console.error('Error al calificar intento:', error)
    throw error
  }
}

/**
 * Lista los intentos del postulante autenticado
 * @param {Object} params - Parámetros de consulta (page, page_size, evaluation_id, status)
 * @returns {Promise} Lista de intentos
 */
export const obtenerMisIntentos = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.page_size) queryParams.append('page_size', params.page_size)
    if (params.evaluation_id) queryParams.append('evaluation_id', params.evaluation_id)
    if (params.status) queryParams.append('status', params.status)

    const queryString = queryParams.toString()
    const endpoint = queryString
      ? `evaluation-attempts/me/?${queryString}`
      : 'evaluation-attempts/me/'

    return await get(endpoint)
  } catch (error) {
    console.error('Error al obtener mis intentos:', error)
    throw error
  }
}

/**
 * Obtiene un intento específico por ID
 * @param {string} attemptId - ID del intento
 * @returns {Promise} Datos del intento
 */
export const obtenerIntentoPorId = async (attemptId) => {
  try {
    return await get(`evaluation-attempts/${attemptId}/`)
  } catch (error) {
    console.error('Error al obtener intento:', error)
    throw error
  }
}

