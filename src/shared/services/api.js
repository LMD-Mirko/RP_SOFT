import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const translateErrorMessage = (message, status) => {
  if (!message) return message
  const lowerMessage = message.toLowerCase()
  if (status === 403) {
    if (lowerMessage.includes('you do not have permission') || lowerMessage.includes('permission denied') || lowerMessage.includes('forbidden')) {
      return 'No tienes permisos para realizar esta acción'
    }
    if (lowerMessage.includes('access denied')) {
      return 'Acceso denegado'
    }
  }
  if (lowerMessage.includes('not found') || lowerMessage.includes('does not exist')) {
    return 'Recurso no encontrado'
  }
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('authentication')) {
    return 'No estás autenticado. Por favor, inicia sesión'
  }
  if (lowerMessage.includes('bad request') || lowerMessage.includes('invalid')) {
    return 'Solicitud inválida'
  }
  if (lowerMessage.includes('server error') || lowerMessage.includes('internal error')) {
    return 'Error del servidor. Por favor, intenta más tarde'
  }
  return message
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      const rawMessage = data?.message || data?.detail || error.message
      const translatedMessage = translateErrorMessage(rawMessage, status)
      return Promise.reject(new ApiError(translatedMessage, status, data))
    }
    const rawMessage = error.message
    return Promise.reject(new ApiError(rawMessage || 'Error de conexión con el servidor', 0, null))
  }
)

const buildUrl = (endpoint) => (endpoint.startsWith('/') ? endpoint : `/${endpoint}`)

export const api = {
  get: (endpoint, config = {}) => instance.get(buildUrl(endpoint), config).then((r) => r.data),
  post: (endpoint, body, config = {}) => instance.post(buildUrl(endpoint), body, config).then((r) => r.data),
  put: (endpoint, body, config = {}) => instance.put(buildUrl(endpoint), body, config).then((r) => r.data),
  patch: (endpoint, body, config = {}) => instance.patch(buildUrl(endpoint), body, config).then((r) => r.data),
  delete: (endpoint, config = {}) => instance.delete(buildUrl(endpoint), config).then((r) => r.data),
}

export default api

