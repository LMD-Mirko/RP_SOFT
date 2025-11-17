/**
 * Utilidad para prevenir peticiones duplicadas
 * Mantiene un registro de peticiones en curso y permite cancelar duplicados
 */

const pendingRequests = new Map();

/**
 * Normaliza una clave para asegurar consistencia
 * @param {string} key - Clave a normalizar
 * @returns {string} Clave normalizada
 */
const normalizeKey = (key) => {
  if (typeof key === 'string') {
    return key;
  }
  
  // Si es un objeto, intentar serializarlo de forma consistente
  try {
    // Convertir a objeto si es necesario
    const obj = typeof key === 'object' && key !== null ? key : { value: key };
    
    // Ordenar las claves del objeto para asegurar consistencia
    const sorted = {};
    Object.keys(obj).sort().forEach(k => {
      sorted[k] = obj[k];
    });
    
    return JSON.stringify(sorted);
  } catch {
    return String(key);
  }
};

/**
 * Crea un guard para prevenir peticiones duplicadas
 * @param {string} key - Identificador único para la petición
 * @param {Function} requestFn - Función que realiza la petición
 * @returns {Promise} Promesa de la petición
 */
export const requestGuard = async (key, requestFn) => {
  // Normalizar la clave
  const normalizedKey = normalizeKey(key);
  
  // Si ya hay una petición en curso con la misma clave, retornar la misma promesa
  if (pendingRequests.has(normalizedKey)) {
    const existingPromise = pendingRequests.get(normalizedKey);
    // Verificar que la promesa aún esté pendiente
    return existingPromise;
  }

  // Crear la promesa de la petición
  const requestPromise = (async () => {
    try {
      const result = await requestFn();
      return result;
    } catch (error) {
      // Re-lanzar el error para que el llamador pueda manejarlo
      throw error;
    } finally {
      // Limpiar la petición del mapa cuando termine (con un pequeño delay para evitar race conditions)
      setTimeout(() => {
        pendingRequests.delete(normalizedKey);
      }, 100);
    }
  })();

  // Guardar la promesa en el mapa
  pendingRequests.set(normalizedKey, requestPromise);

  return requestPromise;
};

/**
 * Cancela una petición pendiente
 * @param {string} key - Identificador de la petición
 */
export const cancelRequest = (key) => {
  if (pendingRequests.has(key)) {
    pendingRequests.delete(key);
  }
};

/**
 * Limpia todas las peticiones pendientes
 */
export const clearAllRequests = () => {
  pendingRequests.clear();
};

/**
 * Hook para usar requestGuard en componentes React
 * @param {string} key - Identificador único para la petición
 * @param {Function} requestFn - Función que realiza la petición
 * @param {Array} deps - Dependencias para regenerar la clave si cambian
 * @returns {Function} Función protegida que ejecuta la petición
 */
export const useRequestGuard = (key, requestFn, deps = []) => {
  const { useMemo, useCallback } = require('react');
  
  const guardedRequest = useCallback(
    async (...args) => {
      const requestKey = typeof key === 'function' ? key(...args) : `${key}_${JSON.stringify(args)}`;
      return requestGuard(requestKey, () => requestFn(...args));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, requestFn, ...deps]
  );

  return guardedRequest;
};

