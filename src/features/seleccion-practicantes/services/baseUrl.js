/**
 * Configuración de Base URL para el módulo Selección de Practicantes
 * Define la URL base de la API para todas las peticiones del módulo
 */

// Base URL de la API - puede venir de variables de entorno o usar un valor por defecto
// En desarrollo, usar '/api' para que pase por el proxy de Vite y evite CORS
// En producción, usar la URL completa del servidor
const FALLBACK_BASE = import.meta.env.DEV ? '/api' : 'http://0.0.0.0:8000/api'

export const BASE_URL =
  import.meta.env.VITE_SELECCION_PRACTICANTES_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  FALLBACK_BASE;

/**
 * Construye una URL completa combinando la base URL con un endpoint
 * @param {string} endpoint - El endpoint a concatenar (ej: '/login', '/postulantes')
 * @returns {string} URL completa
 */
export const buildUrl = (endpoint) => {
  // Asegurar que el endpoint comience con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Remover trailing slash de BASE_URL si existe
  const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

export default BASE_URL;


