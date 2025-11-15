/**
 * Servicio API base para hacer llamadas HTTP al backend
 * Centraliza la configuración de la API y manejo de errores
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Clase de error personalizada para errores de API
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Realiza una petición HTTP al backend
 * @param {string} endpoint - Ruta del endpoint (sin /api)
 * @param {object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise} Respuesta parseada de la API
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    ...restOptions
  } = options

  // Construir URL completa
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  // Headers por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Si hay body y no es FormData, convertir a JSON
  let requestBody = body
  if (body && !(body instanceof FormData)) {
    if (typeof body === 'object') {
      requestBody = JSON.stringify(body)
    }
  } else if (body instanceof FormData) {
    // Si es FormData, no establecer Content-Type (el navegador lo hace automáticamente)
    delete defaultHeaders['Content-Type']
  }

  try {
    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: requestBody,
      ...restOptions,
    })

    // Leer respuesta
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')
    
    let data
    if (isJson) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Si la respuesta no es exitosa, lanzar error
    if (!response.ok) {
      throw new ApiError(
        data?.message || `Error ${response.status}: ${response.statusText}`,
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    // Si ya es un ApiError, relanzarlo
    if (error instanceof ApiError) {
      throw error
    }

    // Error de red u otro error
    // En desarrollo, no loguear errores de conexión si el backend no está disponible
    const isConnectionError = error.message?.includes('Failed to fetch') || 
                              error.message?.includes('ERR_CONNECTION_REFUSED') ||
                              error.message?.includes('NetworkError')
    
    if (isConnectionError && import.meta.env.DEV) {
      // En desarrollo, solo loguear en modo verbose
      // El código que llama a la API ya maneja estos errores
    }

    throw new ApiError(
      error.message || 'Error de conexión con el servidor',
      0,
      null
    )
  }
}

/**
 * Métodos de conveniencia para diferentes tipos de peticiones
 */
export const api = {
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'POST', body }),

  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PUT', body }),

  patch: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PATCH', body }),

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
}

export default api

