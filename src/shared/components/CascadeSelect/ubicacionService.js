/**
 * Servicio para obtener datos de ubicación (regiones, provincias, distritos)
 * Utiliza los endpoints de la API para obtener información geográfica
 */

import { get } from '@features/seleccion-practicantes/services/methods';

const COUNTRY_ID = 184; // ID de Perú

/**
 * Obtiene todas las regiones (departamentos) del país
 * @returns {Promise<Array>} Lista de regiones
 */
export const getRegiones = async () => {
  try {
    const response = await get(`countries/${COUNTRY_ID}/regions/`);
    return response.results || [];
  } catch (error) {
    console.error('Error al obtener regiones:', error);
    throw error;
  }
};

/**
 * Obtiene las provincias de una región específica
 * @param {number} regionId - ID de la región
 * @returns {Promise<Array>} Lista de provincias
 */
export const getProvincias = async (regionId) => {
  if (!regionId) {
    return [];
  }
  
  try {
    const response = await get(`regions/${regionId}/provinces/`);
    return response.results || [];
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    throw error;
  }
};

/**
 * Obtiene los distritos de una provincia específica
 * @param {number} provinceId - ID de la provincia
 * @returns {Promise<Array>} Lista de distritos
 */
export const getDistritos = async (provinceId) => {
  if (!provinceId) {
    return [];
  }
  
  try {
    const response = await get(`provinces/${provinceId}/districts/`);
    return response.results || [];
  } catch (error) {
    console.error('Error al obtener distritos:', error);
    throw error;
  }
};

