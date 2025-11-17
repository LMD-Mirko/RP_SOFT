/**
 * Servicio para gestionar preguntas y opciones de respuesta de evaluaciones
 */

import { get, post, put, patch, del } from '../../../services/methods'

/**
 * Obtiene todas las preguntas de una evaluación
 * @param {string} evaluationId - ID de la evaluación
 * @param {Object} params - Parámetros de consulta (include_answer_options)
 * @returns {Promise} Lista de preguntas
 */
export const getPreguntas = async (evaluationId, params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params.include_answer_options !== undefined) {
      queryParams.append('include_answer_options', params.include_answer_options)
    }

    const queryString = queryParams.toString()
    const endpoint = queryString
      ? `evaluations/${evaluationId}/questions/?${queryString}`
      : `evaluations/${evaluationId}/questions/`

    return await get(endpoint)
  } catch (error) {
    console.error('Error al obtener preguntas:', error)
    throw error
  }
}

/**
 * Obtiene una pregunta específica
 * @param {string} evaluationId - ID de la evaluación
 * @param {string} questionId - ID de la pregunta
 * @returns {Promise} Datos de la pregunta
 */
export const getPreguntaById = async (evaluationId, questionId) => {
  try {
    return await get(`evaluations/${evaluationId}/questions/${questionId}/`)
  } catch (error) {
    console.error('Error al obtener pregunta:', error)
    throw error
  }
}

/**
 * Crea una nueva pregunta
 * @param {string} evaluationId - ID de la evaluación
 * @param {Object} data - Datos de la pregunta (text, question_type, order, points)
 * @returns {Promise} Pregunta creada
 */
export const createPregunta = async (evaluationId, data) => {
  try {
    return await post(`evaluations/${evaluationId}/questions/`, data)
  } catch (error) {
    console.error('Error al crear pregunta:', error)
    throw error
  }
}

/**
 * Actualiza una pregunta
 * @param {string} evaluationId - ID de la evaluación
 * @param {string} questionId - ID de la pregunta
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Pregunta actualizada
 */
export const updatePregunta = async (evaluationId, questionId, data) => {
  try {
    return await patch(`evaluations/${evaluationId}/questions/${questionId}/`, data)
  } catch (error) {
    console.error('Error al actualizar pregunta:', error)
    throw error
  }
}

/**
 * Elimina una pregunta
 * @param {string} evaluationId - ID de la evaluación
 * @param {string} questionId - ID de la pregunta
 * @returns {Promise} Resultado de la operación
 */
export const deletePregunta = async (evaluationId, questionId) => {
  try {
    return await del(`evaluations/${evaluationId}/questions/${questionId}/`)
  } catch (error) {
    console.error('Error al eliminar pregunta:', error)
    throw error
  }
}

/**
 * Reordena las preguntas
 * @param {string} evaluationId - ID de la evaluación
 * @param {Array} questionOrders - Array de objetos {question_id, order}
 * @returns {Promise} Resultado de la operación
 */
export const reorderPreguntas = async (evaluationId, questionOrders) => {
  try {
    return await post(`evaluations/${evaluationId}/questions/reorder/`, {
      question_orders: questionOrders,
    })
  } catch (error) {
    console.error('Error al reordenar preguntas:', error)
    throw error
  }
}

/**
 * Obtiene las opciones de respuesta de una pregunta
 * @param {string} evaluationId - ID de la evaluación
 * @param {string} questionId - ID de la pregunta
 * @returns {Promise} Lista de opciones de respuesta
 */
export const getOpcionesRespuesta = async (evaluationId, questionId) => {
  try {
    return await get(`evaluations/${evaluationId}/questions/${questionId}/answer-options/`)
  } catch (error) {
    console.error('Error al obtener opciones de respuesta:', error)
    throw error
  }
}

/**
 * Crea una opción de respuesta
 * @param {string} evaluationId - ID de la evaluación
 * @param {string} questionId - ID de la pregunta
 * @param {Object} data - Datos de la opción (text, is_correct, order)
 * @returns {Promise} Opción creada
 */
export const createOpcionRespuesta = async (evaluationId, questionId, data) => {
  try {
    return await post(`evaluations/${evaluationId}/questions/${questionId}/answer-options/`, data)
  } catch (error) {
    console.error('Error al crear opción de respuesta:', error)
    throw error
  }
}

/**
 * Actualiza una opción de respuesta
 * @param {string} evaluationId - ID de la evaluación
 * @param {string} questionId - ID de la pregunta
 * @param {string} optionId - ID de la opción
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Opción actualizada
 */
export const updateOpcionRespuesta = async (evaluationId, questionId, optionId, data) => {
  try {
    return await patch(
      `evaluations/${evaluationId}/questions/${questionId}/answer-options/${optionId}/`,
      data
    )
  } catch (error) {
    console.error('Error al actualizar opción de respuesta:', error)
    throw error
  }
}

/**
 * Elimina una opción de respuesta
 * @param {string} evaluationId - ID de la evaluación
 * @param {string} questionId - ID de la pregunta
 * @param {string} optionId - ID de la opción
 * @returns {Promise} Resultado de la operación
 */
export const deleteOpcionRespuesta = async (evaluationId, questionId, optionId) => {
  try {
    return await del(
      `evaluations/${evaluationId}/questions/${questionId}/answer-options/${optionId}/`
    )
  } catch (error) {
    console.error('Error al eliminar opción de respuesta:', error)
    throw error
  }
}

