/**
 * Servicio para gestionar archivos y documentos
 */

import { get, post, del } from '../../../services/methods';
import { httpClient } from '../../../services/methods';

/**
 * Sube un documento
 * @param {File} file - Archivo a subir
 * @param {string} documentType - Tipo de documento (opcional)
 * @returns {Promise} Información del archivo subido
 */
export const uploadFile = async (file, documentType = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (documentType) {
      formData.append('document_type', documentType);
    }

    const response = await httpClient.post('files/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw error;
  }
};

/**
 * Lista los documentos del usuario autenticado
 * @param {Object} params - Parámetros de consulta (page, page_size)
 * @returns {Promise} Lista de documentos
 */
export const getMyDocuments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `files/my-documents/?${queryString}` : 'files/my-documents/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw error;
  }
};

/**
 * Obtiene la URL de descarga de un documento
 * @param {number} documentId - ID del documento
 * @returns {Promise} URL de descarga
 */
export const getDownloadUrl = async (documentId) => {
  try {
    return await get(`files/${documentId}/download/`);
  } catch (error) {
    console.error('Error al obtener URL de descarga:', error);
    throw error;
  }
};

/**
 * Elimina un documento
 * @param {number} documentId - ID del documento
 * @returns {Promise} Resultado de la operación
 */
export const deleteDocument = async (documentId) => {
  try {
    return await del(`files/${documentId}/`);
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
};

