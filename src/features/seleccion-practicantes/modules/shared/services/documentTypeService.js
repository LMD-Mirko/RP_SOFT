/**
 * Servicio para gestionar tipos de documento
 */

import { get, post, put, patch, del } from '../../../services/methods';

/**
 * Lista todos los tipos de documento
 * @param {Object} params - Parámetros de consulta
 * @returns {Promise} Lista de tipos de documento
 */
export const getDocumentTypes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    if (params.search) queryParams.append('search', params.search);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `document-types/?${queryString}` : 'document-types/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener tipos de documento:', error);
    throw error;
  }
};

/**
 * Obtiene un tipo de documento por ID (Solo Admin)
 * @param {number} documentTypeId - ID del tipo de documento
 * @returns {Promise} Datos del tipo de documento
 */
export const getDocumentTypeById = async (documentTypeId) => {
  try {
    return await get(`document-types/${documentTypeId}/`);
  } catch (error) {
    console.error('Error al obtener tipo de documento:', error);
    throw error;
  }
};

/**
 * Crea un nuevo tipo de documento (Solo Admin)
 * @param {Object} data - Datos del tipo de documento
 * @returns {Promise} Tipo de documento creado
 */
export const createDocumentType = async (data) => {
  try {
    return await post('document-types/', data);
  } catch (error) {
    console.error('Error al crear tipo de documento:', error);
    throw error;
  }
};

/**
 * Actualiza un tipo de documento (Solo Admin)
 * @param {number} documentTypeId - ID del tipo de documento
 * @param {Object} data - Datos a actualizar
 * @param {boolean} partial - Si es true, usa PATCH; si es false, usa PUT
 * @returns {Promise} Tipo de documento actualizado
 */
export const updateDocumentType = async (documentTypeId, data, partial = true) => {
  try {
    if (partial) {
      return await patch(`document-types/${documentTypeId}/`, data);
    } else {
      return await put(`document-types/${documentTypeId}/`, data);
    }
  } catch (error) {
    console.error('Error al actualizar tipo de documento:', error);
    throw error;
  }
};

/**
 * Elimina un tipo de documento (Solo Admin)
 * @param {number} documentTypeId - ID del tipo de documento
 * @returns {Promise} Resultado de la operación
 */
export const deleteDocumentType = async (documentTypeId) => {
  try {
    return await del(`document-types/${documentTypeId}/`);
  } catch (error) {
    console.error('Error al eliminar tipo de documento:', error);
    throw error;
  }
};

