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

