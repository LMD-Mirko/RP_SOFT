/**
 * Sistema de configuración dinámica de variables de entorno
 * Permite cambiar las variables de entorno sin recompilar el proyecto
 * 
 * Prioridad:
 * 1. Configuración dinámica guardada en localStorage
 * 2. Variables de entorno del build (import.meta.env)
 * 3. Valores por defecto
 */

const STORAGE_KEY = 'rpsoft_env_config'

/**
 * Variables de entorno configurables
 */
export const ENV_VARIABLES = {
  VITE_API_BASE_URL: {
    label: 'URL Base de la API',
    description: 'URL base para todas las peticiones al backend. En desarrollo, dejar vacío para usar el proxy de Vite (/api)',
    type: 'url',
    default: '',
    required: false,
  },
  VITE_MICROSOFT_CLIENT_ID: {
    label: 'Microsoft Client ID',
    description: 'ID de cliente para autenticación con Microsoft Azure AD',
    type: 'text',
    default: '',
    required: false,
  },
  VITE_MICROSOFT_AUTHORITY: {
    label: 'Microsoft Authority',
    description: 'Autoridad de Microsoft (tenant ID o common)',
    type: 'url',
    default: 'https://login.microsoftonline.com/common',
    required: false,
  },
  VITE_MICROSOFT_REDIRECT_URI: {
    label: 'Microsoft Redirect URI',
    description: 'URI de redirección después de autenticación Microsoft',
    type: 'url',
    default: '',
    required: false,
  },
  VITE_GOOGLE_CLIENT_ID: {
    label: 'Google Client ID',
    description: 'ID de cliente para autenticación con Google',
    type: 'text',
    default: '',
    required: false,
  },
}

/**
 * Obtiene la configuración guardada desde localStorage
 * @returns {Object} Configuración guardada o objeto vacío
 */
export const getStoredConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error al leer configuración guardada:', error)
  }
  return {}
}

/**
 * Guarda la configuración en localStorage
 * @param {Object} config - Configuración a guardar
 */
export const saveConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new CustomEvent('envConfigChanged'))
    return true
  } catch (error) {
    console.error('Error al guardar configuración:', error)
    return false
  }
}

/**
 * Obtiene el valor de una variable de entorno con prioridad en configuración dinámica
 * @param {string} key - Nombre de la variable de entorno
 * @param {string} defaultValue - Valor por defecto si no existe
 * @returns {string} Valor de la variable
 */
export const getEnvVar = (key, defaultValue = '') => {
  // 1. Prioridad: Configuración dinámica guardada (solo si tiene un valor válido)
  const storedConfig = getStoredConfig()
  if (storedConfig[key] !== undefined && storedConfig[key] !== null && storedConfig[key] !== '') {
    return storedConfig[key]
  }

  // 2. Segunda prioridad: Variables de entorno del build
  if (import.meta.env[key]) {
    return import.meta.env[key]
  }

  // 3. Tercera prioridad: Valor por defecto inteligente según el entorno
  // Para URLs de API en desarrollo, usar ruta relativa para pasar por el proxy de Vite
  if (key.includes('API_URL') || key.includes('API_BASE_URL')) {
    if (import.meta.env.DEV) {
      // En desarrollo, usar ruta relativa para que pase por el proxy de Vite
      // Esto evita problemas de CORS
      return '/api'
    }
    // En producción, usar el valor por defecto del build o el proporcionado
    if (ENV_VARIABLES[key]?.default) {
      return ENV_VARIABLES[key].default
    }
    return defaultValue || 'http://localhost:8000/api'
  }

  // Para otras variables, usar el valor por defecto del build
  if (ENV_VARIABLES[key]?.default) {
    return ENV_VARIABLES[key].default
  }

  return defaultValue
}

/**
 * Obtiene todas las variables de entorno con sus valores actuales
 * @returns {Object} Objeto con todas las variables y sus valores
 */
export const getAllEnvVars = () => {
  const result = {}
  Object.keys(ENV_VARIABLES).forEach((key) => {
    result[key] = getEnvVar(key)
  })
  return result
}

/**
 * Resetea la configuración a los valores por defecto del build
 */
export const resetConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('envConfigChanged'))
    return true
  } catch (error) {
    console.error('Error al resetear configuración:', error)
    return false
  }
}

/**
 * Exporta la configuración actual como JSON
 * @returns {string} JSON string de la configuración
 */
export const exportConfig = () => {
  const config = getStoredConfig()
  return JSON.stringify(config, null, 2)
}

/**
 * Importa configuración desde JSON
 * @param {string} jsonString - JSON string con la configuración
 * @returns {boolean} true si se importó correctamente
 */
export const importConfig = (jsonString) => {
  try {
    const config = JSON.parse(jsonString)
    // Validar que solo contenga claves válidas
    const validKeys = Object.keys(ENV_VARIABLES)
    const filteredConfig = {}
    Object.keys(config).forEach((key) => {
      if (validKeys.includes(key)) {
        filteredConfig[key] = config[key]
      }
    })
    return saveConfig(filteredConfig)
  } catch (error) {
    console.error('Error al importar configuración:', error)
    return false
  }
}

