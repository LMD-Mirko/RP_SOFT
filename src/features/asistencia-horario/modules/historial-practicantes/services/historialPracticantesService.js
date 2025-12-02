/**
 * Servicio para gestionar historial de practicantes
 * Endpoints: /api/practicantes/historial/
 */

import { get, post } from '../../../services';

/**
 * Obtiene el historial de acciones de practicantes con filtros y paginación
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.busqueda - Texto para buscar en descripción o detalles
 * @param {string} params.area - Filtrar por área del practicante
 * @param {string} params.tipo_accion - Tipo de acción (advertencia, traslado, expulsion, otro)
 * @param {string} params.estado - Estado final del practicante (activo, en_recuperacion, en_riesgo, trasladado, expulsado)
 * @param {string} params.fecha_desde - Fecha de inicio (YYYY-MM-DD)
 * @param {string} params.fecha_hasta - Fecha de fin (YYYY-MM-DD)
 * @param {number} params.pagina - Número de página (default: 1)
 * @param {number} params.por_pagina - Elementos por página (default: 10)
 * @returns {Promise} Historial con paginación {
 *   data: Array<AccionPracticante>,
 *   paginacion: {
 *     total: number,
 *     pagina: number,
 *     por_pagina: number,
 *     total_paginas: number
 *   }
 * }
 */
export const getHistorialAcciones = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.busqueda) queryParams.append('busqueda', params.busqueda);
    if (params.area) queryParams.append('area', params.area);
    if (params.tipo_accion) queryParams.append('tipo_accion', params.tipo_accion);
    if (params.estado) queryParams.append('estado', params.estado);
    if (params.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
    if (params.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
    if (params.pagina) queryParams.append('pagina', params.pagina);
    if (params.por_pagina) queryParams.append('por_pagina', params.por_pagina);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `practicantes/historial/?${queryString}` : 'practicantes/historial/';
    
    return await get(endpoint);
  } catch (error) {
    console.error('Error al obtener historial de acciones:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas del historial de practicantes
 * @returns {Promise} Estadísticas {
 *   total_registros: number,
 *   total_advertencias: number,
 *   total_traslados: number,
 *   total_expulsiones: number,
 *   total_practicantes: number,
 *   total_activos: number,
 *   total_trasladados: number,
 *   total_expulsados: number,
 *   total_en_reforzamiento: number
 * }
 */
export const getEstadisticasHistorial = async () => {
  try {
    return await get('practicantes/historial/estadisticas/');
  } catch (error) {
    console.error('Error al obtener estadísticas del historial:', error);
    throw error;
  }
};

/**
 * Registra una nueva acción en el historial de un practicante
 * @param {Object} data - Datos de la acción
 * @param {number} data.practicante_id - ID del practicante
 * @param {string} data.tipo_accion - Tipo de acción (advertencia, traslado, expulsion, otro)
 * @param {string} data.descripcion - Descripción de la acción
 * @param {Object} data.detalles - Detalles adicionales de la acción (opcional)
 * @returns {Promise} Acción registrada {
 *   id: number,
 *   fecha: string (ISO8601),
 *   practicante_id: number,
 *   tipo_accion: string,
 *   descripcion: string,
 *   usuario: string,
 *   detalles: object
 * }
 */
export const registrarAccion = async (data) => {
  try {
    // Validar campos requeridos
    const requiredFields = ['practicante_id', 'tipo_accion', 'descripcion'];
    const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
    
    if (missingFields.length > 0) {
      throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
    }

    return await post('practicantes/historial/acciones/', data);
  } catch (error) {
    console.error('Error al registrar acción:', error);
    throw error;
  }
};

