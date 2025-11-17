/**
 * Servicio para gestionar CVs de administradores
 * Permite listar, previsualizar y descargar CVs de todos los postulantes
 */

import { get } from '../../../services/methods';
import { httpClient } from '../../../services/methods';
import { getAccessToken } from '../../../shared/utils/cookieHelper';
import { BASE_URL } from '../../../services/baseUrl';

/**
 * Lista todos los CVs con paginación y filtros
 * @param {Object} params - Parámetros de consulta
 * @param {number} params.postulant_id - Filtrar por ID de postulante
 * @param {number} params.job_posting_id - Filtrar por ID de convocatoria
 * @param {number} params.page - Número de página
 * @param {number} params.page_size - Tamaño de página
 * @returns {Promise} Lista paginada de CVs
 */
export const listAllCVs = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.postulant_id) {
      queryParams.append('postulant_id', params.postulant_id);
    }
    if (params.job_posting_id) {
      queryParams.append('job_posting_id', params.job_posting_id);
    }
    if (params.page) {
      queryParams.append('page', params.page);
    }
    if (params.page_size) {
      queryParams.append('page_size', params.page_size);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `files/cvs/?${queryString}` : 'files/cvs/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al listar CVs:', error);
    throw error;
  }
};

/**
 * Obtiene la URL de previsualización de un CV
 * El backend actúa como proxy, descargando el archivo de MinIO y sirviéndolo al cliente
 * @param {number} documentId - ID del documento
 * @returns {string} URL de previsualización
 */
export const getPreviewUrl = (documentId) => {
  // Usar BASE_URL del servicio que ya incluye /api
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  // El backend actúa como proxy y lee las cookies de autenticación automáticamente
  // No necesitamos pasar el token en la URL
  return `${baseUrl}/files/cvs/${documentId}/preview/`;
};

/**
 * Descarga un CV directamente
 * El backend actúa como proxy, descargando el archivo de MinIO y sirviéndolo al cliente
 * @param {number} documentId - ID del documento
 * @param {boolean} forceDownload - Si es true, fuerza la descarga (default: true)
 * @returns {Promise<Blob>} Blob del archivo PDF
 */
export const downloadCV = async (documentId, forceDownload = true) => {
  try {
    const endpoint = `files/${documentId}/download/${forceDownload ? '?download=true' : ''}`;
    
    // Usar httpClient para que incluya automáticamente el token en los headers
    const response = await httpClient.get(endpoint, {
      responseType: 'blob', // Importante: especificar que esperamos un blob
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al descargar CV:', error);
    throw error;
  }
};

/**
 * Obtiene el PDF como blob para previsualización
 * @param {number} documentId - ID del documento
 * @returns {Promise<Blob>} Blob del archivo PDF
 */
export const getPDFBlob = async (documentId) => {
  try {
    const endpoint = `files/cvs/${documentId}/preview/`;
    
    // Usar httpClient para que incluya automáticamente el token en los headers
    const response = await httpClient.get(endpoint, {
      responseType: 'blob',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener PDF para previsualización:', error);
    throw error;
  }
};

