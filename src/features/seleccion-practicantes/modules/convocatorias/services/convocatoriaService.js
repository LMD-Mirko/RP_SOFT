/**
 * Servicio para gestionar convocatorias
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todas las convocatorias
 * @param {Object} params - Parámetros de consulta (page, page_size, estado)
 * @returns {Promise} Lista de convocatorias
 */
export const getConvocatorias = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.estado) queryParams.append('estado', params.estado);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `convocatorias/?${queryString}` : 'convocatorias/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener convocatorias:', error);
    throw error;
  }
};

/**
 * Obtiene una convocatoria por ID
 * @param {number} id - ID de la convocatoria
 * @returns {Promise} Datos de la convocatoria
 */
export const getConvocatoriaById = async (id) => {
  try {
    return await get(`convocatorias/${id}/`);
  } catch (error) {
    console.error('Error al obtener convocatoria:', error);
    throw error;
  }
};

/**
 * Crea una nueva convocatoria
 * @param {Object} data - Datos de la convocatoria
 * @returns {Promise} Convocatoria creada
 */
export const createConvocatoria = async (data) => {
  try {
    return await post('convocatorias/', data);
  } catch (error) {
    console.error('Error al crear convocatoria:', error);
    throw error;
  }
};

/**
 * Actualiza una convocatoria
 * @param {number} id - ID de la convocatoria
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Convocatoria actualizada
 */
export const updateConvocatoria = async (id, data) => {
  try {
    return await patch(`convocatorias/${id}/`, data);
  } catch (error) {
    console.error('Error al actualizar convocatoria:', error);
    throw error;
  }
};

/**
 * Cierra una convocatoria
 * @param {number} id - ID de la convocatoria
 * @returns {Promise} Resultado de la operación
 */
export const cerrarConvocatoria = async (id) => {
  try {
    return await post(`convocatorias/${id}/cerrar`);
  } catch (error) {
    console.error('Error al cerrar convocatoria:', error);
    throw error;
  }
};

/**
 * Elimina una convocatoria
 * @param {number} id - ID de la convocatoria
 * @returns {Promise} Resultado de la operación
 */
export const deleteConvocatoria = async (id) => {
  try {
    return await del(`convocatorias/${id}/`);
  } catch (error) {
    console.error('Error al eliminar convocatoria:', error);
    throw error;
  }
};

// ============================================
// MÉTODOS PARA GESTIÓN DE ENCUESTAS
// ============================================

/**
 * Obtiene las 4 encuestas de una convocatoria
 * @param {number} jobPostingId - ID de la convocatoria
 * @param {boolean} includeQuestions - Si incluir preguntas (default: false)
 * @returns {Promise} Objeto con las 4 encuestas
 */
export const getEvaluacionesAll = async (jobPostingId, includeQuestions = false) => {
  try {
    return await get(`convocatorias/${jobPostingId}/evaluations/all/?include_questions=${includeQuestions}`);
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    throw error;
  }
};

/**
 * Obtiene una evaluación específica con sus preguntas
 * @param {number} jobPostingId - ID de la convocatoria
 * @param {string} evaluationType - Tipo de evaluación (profile, technical, psychological, motivation)
 * @returns {Promise} Evaluación con preguntas y opciones
 */
export const getEvaluacionByType = async (jobPostingId, evaluationType) => {
  try {
    return await get(`convocatorias/${jobPostingId}/evaluations/${evaluationType}/?include_questions=true`);
  } catch (error) {
    console.error('Error al obtener evaluación:', error);
    throw error;
  }
};

/**
 * Crea una nueva pregunta para una evaluación
 * @param {string} evaluationId - ID de la evaluación (UUID)
 * @param {Object} data - Datos de la pregunta { text, order, is_active }
 * @returns {Promise} Pregunta creada
 */
export const createQuestion = async (evaluationId, data) => {
  try {
    return await post(`evaluations/${evaluationId}/questions/`, data);
  } catch (error) {
    console.error('Error al crear pregunta:', error);
    throw error;
  }
};

/**
 * Actualiza una pregunta
 * @param {string} questionId - ID de la pregunta (UUID)
 * @param {Object} data - Datos a actualizar { text, order, is_active }
 * @returns {Promise} Pregunta actualizada
 */
export const updateQuestion = async (questionId, data) => {
  try {
    return await patch(`questions/${questionId}/`, data);
  } catch (error) {
    console.error('Error al actualizar pregunta:', error);
    throw error;
  }
};

/**
 * Elimina una pregunta
 * @param {string} questionId - ID de la pregunta (UUID)
 * @returns {Promise} Resultado de la operación
 */
export const deleteQuestion = async (questionId) => {
  try {
    return await del(`questions/${questionId}/`);
  } catch (error) {
    console.error('Error al eliminar pregunta:', error);
    throw error;
  }
};

/**
 * Crea una nueva opción para una pregunta
 * @param {string} questionId - ID de la pregunta (UUID)
 * @param {Object} data - Datos de la opción { text, is_correct, order }
 * @returns {Promise} Opción creada
 */
export const createOption = async (questionId, data) => {
  try {
    return await post(`questions/${questionId}/options/`, data);
  } catch (error) {
    console.error('Error al crear opción:', error);
    throw error;
  }
};

/**
 * Actualiza una opción
 * @param {string} optionId - ID de la opción (UUID)
 * @param {Object} data - Datos a actualizar { text, is_correct, order }
 * @returns {Promise} Opción actualizada
 */
export const updateOption = async (optionId, data) => {
  try {
    return await patch(`answer-options/${optionId}/`, data);
  } catch (error) {
    console.error('Error al actualizar opción:', error);
    throw error;
  }
};

/**
 * Elimina una opción
 * @param {string} optionId - ID de la opción (UUID)
 * @returns {Promise} Resultado de la operación
 */
export const deleteOption = async (optionId) => {
  try {
    return await del(`answer-options/${optionId}/`);
  } catch (error) {
    console.error('Error al eliminar opción:', error);
    throw error;
  }
};

/**
 * Crea o actualiza una evaluación completa desde JSON
 * @param {Object} jsonData - Datos JSON con evaluation y questions
 * @returns {Promise} Resultado con la evaluación creada/actualizada y estadísticas
 */
export const createEvaluationFromJson = async (jsonData) => {
  try {
    return await post('evaluations/create-from-json/', jsonData);
  } catch (error) {
    console.error('Error al crear evaluación desde JSON:', error);
    throw error;
  }
};

