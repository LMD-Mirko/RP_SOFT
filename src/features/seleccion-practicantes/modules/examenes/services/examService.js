/**
 * Servicio para gestionar exámenes
 */

import { get, post, put, patch, del } from '../../../services/methods'

/**
 * Crea un examen básico (sin preguntas)
 * @param {Object} data - Datos del examen
 * @returns {Promise} Examen creado
 */
export const createExam = async (data) => {
  try {
    return await post('exams/', data)
  } catch (error) {
    console.error('Error al crear examen:', error)
    throw error
  }
}

/**
 * Crea un examen desde JSON completo
 * @param {Object} data - Datos del examen con exam y questions
 * @returns {Promise} Examen creado
 */
export const createExamFromJson = async (data) => {
  try {
    return await post('exams/create-from-json/', data)
  } catch (error) {
    console.error('Error al crear examen desde JSON:', error)
    throw error
  }
}

/**
 * Lista todos los exámenes
 * @param {Object} params - Parámetros de consulta (page, page_size)
 * @returns {Promise} Lista de exámenes
 */
export const getExams = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.page_size) queryParams.append('page_size', params.page_size)

    const queryString = queryParams.toString()
    const endpoint = queryString ? `exams/?${queryString}` : 'exams/'
    
    return await get(endpoint)
  } catch (error) {
    console.error('Error al obtener exámenes:', error)
    throw error
  }
}

/**
 * Obtiene un examen por ID con sus preguntas
 * @param {string} examId - ID del examen (UUID)
 * @returns {Promise} Datos del examen con preguntas
 */
export const getExamById = async (examId) => {
  try {
    return await get(`exams/${examId}/`)
  } catch (error) {
    console.error('Error al obtener examen:', error)
    throw error
  }
}

/**
 * Obtiene la vista de examen para usuarios asignados
 * @param {string} examId - ID del examen (UUID)
 * @returns {Promise} Datos del examen visibles para postulantes/admin asignados
 */
export const getExamView = async (examId) => {
  try {
    return await get(`exams/${examId}/view/`)
  } catch (error) {
    console.error('Error al obtener vista de examen:', error)
    throw error
  }
}

/**
 * Obtiene el intento activo (si existe) junto con respuestas guardadas
 * @param {string} examId
 * @returns {Promise} { active_attempt, answers }
 */
export const getExamActiveAttempt = async (examId) => {
  try {
    return await get(`exams/${examId}/active-attempt/`)
  } catch (error) {
    console.error('Error al obtener intento activo del examen:', error)
    throw error
  }
}

/**
 * Obtiene usuarios disponibles para asignar exámenes
 * @returns {Promise} Lista de usuarios disponibles
 */
export const getAvailableUsers = async () => {
  try {
    return await get('exams/available-users/')
  } catch (error) {
    console.error('Error al obtener usuarios disponibles:', error)
    throw error
  }
}

/**
 * Asigna un examen a usuarios
 * @param {string} examId - ID del examen (UUID)
 * @param {Object} data - { user_ids: string[] }
 * @returns {Promise} Resultado de la asignación
 */
export const assignExam = async (examId, data) => {
  try {
    return await post(`exams/${examId}/assign/`, data)
  } catch (error) {
    console.error('Error al asignar examen:', error)
    throw error
  }
}

/**
 * Obtiene las asignaciones/participantes de un examen
 * @param {string} examId - ID del examen (UUID)
 * @returns {Promise} Lista de asignaciones con información de usuarios
 */
export const getExamAssignments = async (examId) => {
  try {
    return await get(`exams/${examId}/assignments/`)
  } catch (error) {
    console.error('Error al obtener asignaciones del examen:', error)
    throw error
  }
}

/**
 * Inicia un intento de examen
 * @param {string} examId - ID del examen (UUID)
 * @returns {Promise} Intento creado
 */
export const startExamAttempt = async (examId) => {
  try {
    return await post(`exams/${examId}/start/`)
  } catch (error) {
    console.error('Error al iniciar intento de examen:', error)
    throw error
  }
}

/**
 * Guarda respuestas en batch
 * @param {string} attemptId - ID del intento (UUID)
 * @param {Object} data - { answers: Array }
 * @returns {Promise} Resultado
 */
export const saveAnswersBatch = async (attemptId, data) => {
  try {
    return await post(`exam-attempts/${attemptId}/answers/batch/`, data)
  } catch (error) {
    console.error('Error al guardar respuestas:', error)
    throw error
  }
}

/**
 * Califica un intento de examen
 * @param {string} attemptId - ID del intento (UUID)
 * @returns {Promise} Resultado de la calificación
 */
export const gradeAttempt = async (attemptId) => {
  try {
    return await post(`exam-attempts/${attemptId}/grade/`)
  } catch (error) {
    console.error('Error al calificar intento:', error)
    throw error
  }
}

/**
 * Obtiene los intentos de un examen
 * @param {string} examId - ID del examen (UUID)
 * @returns {Promise} Lista de intentos
 */
export const getExamAttempts = async (examId) => {
  try {
    return await get(`exams/${examId}/attempts/`)
  } catch (error) {
    console.error('Error al obtener intentos:', error)
    throw error
  }
}

/**
 * Crea múltiples preguntas con opciones para un examen (batch)
 * @param {string} examId - ID del examen (UUID)
 * @param {Object} data - { questions: Array }
 * @returns {Promise} Resultado
 */
export const createQuestionsBatch = async (examId, data) => {
  try {
    return await post(`exams/${examId}/questions/batch/`, data)
  } catch (error) {
    console.error('Error al crear preguntas en batch:', error)
    throw error
  }
}

/**
 * Crea una pregunta para un examen
 * @param {string} examId - ID del examen (UUID)
 * @param {Object} data - Datos de la pregunta
 * @returns {Promise} Pregunta creada
 */
export const createQuestion = async (examId, data) => {
  try {
    return await post(`exams/${examId}/questions/`, data)
  } catch (error) {
    console.error('Error al crear pregunta:', error)
    throw error
  }
}

/**
 * Obtiene una pregunta por ID con sus opciones
 * @param {string} questionId - ID de la pregunta (UUID)
 * @returns {Promise} Pregunta con opciones
 */
export const getQuestionById = async (questionId) => {
  try {
    return await get(`exam-questions/${questionId}/`)
  } catch (error) {
    console.error('Error al obtener pregunta:', error)
    throw error
  }
}

/**
 * Actualiza una pregunta de un examen
 * @param {string} questionId - ID de la pregunta (UUID)
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Pregunta actualizada
 */
export const updateQuestion = async (questionId, data) => {
  try {
    return await patch(`exam-questions/${questionId}/`, data)
  } catch (error) {
    console.error('Error al actualizar pregunta:', error)
    throw error
  }
}

/**
 * Elimina una pregunta de un examen
 * @param {string} questionId - ID de la pregunta (UUID)
 * @returns {Promise} Resultado
 */
export const deleteQuestion = async (questionId) => {
  try {
    return await del(`exam-questions/${questionId}/`)
  } catch (error) {
    console.error('Error al eliminar pregunta:', error)
    throw error
  }
}

/**
 * Obtiene una opción de respuesta por ID
 * @param {string} optionId - ID de la opción (UUID)
 * @returns {Promise} Opción
 */
export const getOptionById = async (optionId) => {
  try {
    return await get(`exam-answer-options/${optionId}/`)
  } catch (error) {
    console.error('Error al obtener opción:', error)
    throw error
  }
}

/**
 * Crea una opción de respuesta para una pregunta
 * @param {string} questionId - ID de la pregunta (UUID)
 * @param {Object} data - Datos de la opción
 * @returns {Promise} Opción creada
 */
export const createOption = async (questionId, data) => {
  try {
    return await post(`exam-questions/${questionId}/options/`, data)
  } catch (error) {
    console.error('Error al crear opción:', error)
    throw error
  }
}

/**
 * Actualiza una opción de respuesta
 * @param {string} optionId - ID de la opción (UUID)
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Opción actualizada
 */
export const updateOption = async (optionId, data) => {
  try {
    return await patch(`exam-answer-options/${optionId}/`, data)
  } catch (error) {
    console.error('Error al actualizar opción:', error)
    throw error
  }
}

/**
 * Elimina una opción de respuesta
 * @param {string} optionId - ID de la opción (UUID)
 * @returns {Promise} Resultado
 */
export const deleteOption = async (optionId) => {
  try {
    return await del(`exam-answer-options/${optionId}/`)
  } catch (error) {
    console.error('Error al eliminar opción:', error)
    throw error
  }
}

/**
 * Actualiza un examen
 * @param {string} examId - ID del examen (UUID)
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Examen actualizado
 */
export const updateExam = async (examId, data) => {
  try {
    return await patch(`exams/${examId}/`, data)
  } catch (error) {
    console.error('Error al actualizar examen:', error)
    throw error
  }
}

/**
 * Elimina un examen
 * @param {string} examId - ID del examen (UUID)
 * @returns {Promise} Resultado
 */
export const deleteExam = async (examId) => {
  try {
    return await del(`exams/${examId}/`)
  } catch (error) {
    console.error('Error al eliminar examen:', error)
    throw error
  }
}

