/**
 * Servicio para obtener tipos de documentos
 */

import { get } from '@features/seleccion-practicantes/services/methods';

/**
 * Obtiene todos los tipos de documentos disponibles
 * @returns {Promise<Array>} Lista de tipos de documentos
 */
export const getDocumentTypes = async () => {
  try {
    const response = await get('document-types/');
    return response.results || [];
  } catch (error) {
    console.error('Error al obtener tipos de documentos:', error);
    throw error;
  }
};

