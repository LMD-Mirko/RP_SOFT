/**
 * Servicio local para gestionar las configuraciones del módulo de convenios-constancias
 */

const LOCAL_STORAGE_KEY = 'cc_config'
function readStorage() { try { const raw = localStorage.getItem(LOCAL_STORAGE_KEY); return raw ? JSON.parse(raw) : null } catch { return null } }
function writeStorage(data) { try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data)); return true } catch { return false } }

// Valores por defecto
const defaultConfig = {
  // Firma Empresa
  firmaEmpresa: {
    imagen: null,
    preview: null,
    posicion: { x: 0, y: 0 },
    size: { width: 200, height: 100 },
  },
  selloEmpresa: {
    imagen: null,
    preview: null,
    posicion: { x: 0, y: 0 },
    size: { width: 200, height: 200 },
  },
  posicionesFirma: {
    convenioTripartito: {
      pagina: 'Ultima',
      posicionX: 'Ultima',
      posicionY: 'Ultima',
    },
    constanciaPracticas: {
      pagina: 'Ultima',
      posicionX: 'Ultima',
      posicionY: 'Ultima',
    },
  },
  
  // Firma Estudiante
  firmaEstudiante: {
    permitirDibujarFirma: true,
    permitirSubirImagen: true,
    validezTokenDias: 10,
  },
  
  // Correos
  correos: {
    compromisosInternos: {
      asunto: 'Completa tus compromisos internos para iniciar tus prácticas',
      cuerpo: `Hola {NOMBRE_ESTUDIANTE},

Bienvenido a RP SOFT. Para iniciar tus prácticas profesionales, necesitas completar y firmar los siguientes compromisos internos:

Haz clic en el siguiente enlace para acceder al portal de firma:
{LINK_PORTAL}

Este enlace es válido por 7 días.

Saludos,
Equipo RP SOFT`,
    },
    documentosSenati: {
      asunto: 'Tus documentos SENATI han sido firmados',
      cuerpo: `Hola {NOMBRE_ESTUDIANTE},

Tus documentos SENATI han sido revisados y firmados por la empresa.

Adjunto encontrarás:
- {DOCUMENTO_1}
- {DOCUMENTO_2}
- {DOCUMENTO_3}

Saludos,
Equipo RP SOFT`,
    },
  },
  
  // Compromisos
  compromisos: [
    {
      id: 1,
      nombre: 'Acuerdo de Confidencialidad',
      configurada: true,
      activa: true,
    },
    {
      id: 2,
      nombre: 'Sesión de Derechos de Autor',
      configurada: true,
      activa: true,
    },
    {
      id: 3,
      nombre: 'Aceptación del Reglamento Interno',
      configurada: true,
      activa: true,
    },
    {
      id: 4,
      nombre: 'Términos y Condiciones',
      configurada: true,
      activa: true,
    },
  ],
  
  // Constancia
  constancia: {
    plantillaPath: '/templates/constancia-base.pdf',
    camposDinamicos: [
      {
        id: 1,
        campo: 'NOMBRE_COMPLETO',
        descripcion: 'Nombre Completo',
        fuente: 'Perfil del estudiante',
      },
      {
        id: 2,
        campo: 'DNI',
        descripcion: 'DNI',
        fuente: 'Perfil del estudiante',
      },
      {
        id: 3,
        campo: 'HORAS_ACUMULADAS',
        descripcion: 'Horas Acumuladas',
        fuente: 'Módulo de asistencia',
      },
      {
        id: 4,
        campo: 'TAREAS_REALIZADAS',
        descripcion: 'Tareas Realizadas',
        fuente: 'Módulo Tasks',
      },
      {
        id: 5,
        campo: 'EVALUACION_FINAL',
        descripcion: 'Evaluación Final',
        fuente: 'Módulo de evaluaciones',
      },
      {
        id: 6,
        campo: 'ROLES_ASUMIDOS',
        descripcion: 'Roles Asumidos',
        fuente: 'Perfil del estudiante',
      },
    ],
  },
}

/**
 * Carga la configuración desde el backend
 */
export async function loadConfiguracion() {
  const stored = readStorage()
  if (stored) return mergeConfig(defaultConfig, stored)
  writeStorage(defaultConfig)
  return defaultConfig
}

/**
 * Guarda la configuración en el backend
 */
export async function saveConfiguracion(config) {
  writeStorage(mergeConfig(defaultConfig, config))
  return true
}

/**
 * Guarda una sección específica de la configuración
 */
export async function saveConfiguracionSection(section, data) {
  const current = readStorage() || defaultConfig
  const updated = { ...current, [section]: data }
  writeStorage(updated)
  return true
}

/**
 * Obtiene una sección específica de la configuración
 */
export async function getConfiguracionSection(section) {
  const current = readStorage() || defaultConfig
  return current?.[section] || null
}

/**
 * Merge profundo de objetos
 */
function mergeConfig(defaultConfig, userConfig) {
  const merged = { ...defaultConfig }
  
  for (const key in userConfig) {
    if (userConfig.hasOwnProperty(key)) {
      if (
        typeof userConfig[key] === 'object' &&
        userConfig[key] !== null &&
        !Array.isArray(userConfig[key]) &&
        typeof defaultConfig[key] === 'object' &&
        defaultConfig[key] !== null &&
        !Array.isArray(defaultConfig[key])
      ) {
        merged[key] = mergeConfig(defaultConfig[key], userConfig[key])
      } else {
        merged[key] = userConfig[key]
      }
    }
  }
  
  return merged
}

/**
 * Resetea la configuración a los valores por defecto
 */
export async function resetConfiguracion() {
  writeStorage(defaultConfig)
  return true
}

/**
 * Valida un archivo de imagen
 */
export function validateImageFile(file) {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  
  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Tipo de archivo no permitido. Use JPG, PNG, GIF, WEBP o SVG' 
    }
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `El archivo es demasiado grande. Tamaño máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB` 
    }
  }
  
  return { valid: true }
}

/**
 * Optimiza una imagen antes de guardarla
 */
export function optimizeImage(file, maxWidth = 2000, maxHeight = 2000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Calcular nuevas dimensiones manteniendo la proporción
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir a blob y luego a base64
        canvas.toBlob(
          (blob) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          },
          file.type,
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'))
      img.src = e.target.result
    }
    
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Sube una imagen al backend y retorna la URL o base64 según lo que devuelva el servidor
 * Con validación y optimización opcional
 */
export async function saveImageAsBase64(file, options = {}) {
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }
  if (options.optimize !== false) {
    return await optimizeImage(
      file,
      options.maxWidth || 2000,
      options.maxHeight || 2000,
      options.quality || 0.8
    )
  }
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Obtiene las dimensiones de una imagen desde base64
 */
export function getImageDimensions(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      })
    }
    img.onerror = reject
    img.src = base64
  })
}

/**
 * Valida que una firma tenga todos los datos necesarios
 */
export function validateFirmaData(firmaData) {
  if (!firmaData) {
    return { valid: false, error: 'No hay datos de firma' }
  }
  
  if (!firmaData.preview) {
    return { valid: false, error: 'La firma no tiene preview' }
  }
  
  if (!firmaData.posicion || typeof firmaData.posicion.x !== 'number' || typeof firmaData.posicion.y !== 'number') {
    return { valid: false, error: 'La posición de la firma no es válida' }
  }
  
  if (!firmaData.size || typeof firmaData.size.width !== 'number' || typeof firmaData.size.height !== 'number') {
    return { valid: false, error: 'El tamaño de la firma no es válido' }
  }
  
  return { valid: true }
}

