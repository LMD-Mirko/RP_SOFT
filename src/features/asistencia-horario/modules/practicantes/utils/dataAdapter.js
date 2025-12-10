/**
 * Adaptador de datos para Practicantes
 * Transforma datos entre el formato del frontend y el backend
 */

/**
 * Transforma datos del formulario frontend al formato esperado por el backend
 * @param {Object} frontendData - Datos del formulario (nombre completo, email, etc.)
 * @returns {Object} - Datos en formato backend (nombre, apellido, correo, estado, id_discord)
 */
export const transformToBackend = (frontendData) => {
    // Separar nombre completo en nombre y apellido
    const nombreParts = (frontendData.nombre || '').trim().split(' ')
    const nombre = nombreParts[0] || ''
    // Si no hay apellido, usar el nombre como apellido (backend no acepta apellido vacío)
    const apellido = nombreParts.slice(1).join(' ') || nombre

    // Mapear el estado del frontend al formato del backend
    const estadoMap = {
        'activo': 'activo',
        'recuperacion': 'en_recuperacion',
        'riesgo': 'en_riesgo',
        'inactivo': 'inactivo',
    }

    // Construir el objeto para el backend según la API del README
    const backendData = {
        // id_discord es REQUERIDO por el backend según el README
        // Si no viene del frontend, generar un valor temporal aleatorio
        id_discord: frontendData.id_discord || Math.floor(Math.random() * 1000000000),
        nombre: nombre,
        apellido: apellido,
        correo: frontendData.email || frontendData.correo,
        semestre: frontendData.semestre || 1,
        estado: estadoMap[frontendData.estado] || frontendData.estado || 'activo',
    }

    return backendData
}

/**
 * Transforma datos del backend al formato esperado por el frontend
 * @param {Object} backendData - Datos de respuesta del backend
 * @returns {Object} - Datos en formato frontend
 */
export const transformFromBackend = (backendData) => {
    const nombreCompleto = `${backendData.nombre || ''} ${backendData.apellido || ''}`.trim()
    const iniciales = nombreCompleto
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    // Mapear el estado del backend al formato del frontend
    const estadoReverseMap = {
        'activo': 'activo',
        'en_recuperacion': 'recuperacion',
        'en_riesgo': 'riesgo',
        'inactivo': 'inactivo',
    }

    return {
        id: backendData.id,
        nombre: nombreCompleto || backendData.correo?.split('@')[0] || 'Sin nombre',
        email: backendData.correo || backendData.email || '',
        equipo: backendData.equipo || 'Rpsoft • Team Alpha',
        servidor: backendData.servidor || 'rpsoft',
        estado: estadoReverseMap[backendData.estado] || backendData.estado || 'activo',
        cohorte: backendData.cohorte || 'Cohorte 2024-A',
        score: backendData.score || 0,
        asistencia: backendData.asistencia || '0%',
        infracciones: backendData.infracciones || 0,
        avatar: iniciales || 'NA',
        color: backendData.color || '#3b82f6',
        semestre: backendData.semestre || 1,
        id_discord: backendData.id_discord
    }
}
