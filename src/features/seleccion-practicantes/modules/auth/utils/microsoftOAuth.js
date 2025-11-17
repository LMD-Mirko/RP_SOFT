/**
 * Utilidades para OAuth con Microsoft
 * Maneja el flujo de autenticación con Microsoft usando MSAL
 */

import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, loginRequest, isMsalConfigured } from '../config/msalConfig'

let msalInstance = null
let initializationPromise = null

/**
 * Inicializa la instancia de MSAL y espera a que esté lista
 * @returns {Promise<PublicClientApplication>} Instancia de MSAL inicializada
 */
export const getMsalInstance = async () => {
  if (!isMsalConfigured()) {
    throw new Error(
      'Microsoft OAuth no está configurado. Por favor, configura VITE_MICROSOFT_CLIENT_ID en tu archivo .env',
    )
  }

  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig)
    initializationPromise = msalInstance.initialize()
  }

  await initializationPromise
  return msalInstance
}

/**
 * Inicia el flujo de login con Microsoft usando popup
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
export const loginWithMicrosoftPopup = async () => {
  try {
    const msal = await getMsalInstance()
    const response = await msal.loginPopup(loginRequest)

    let userInfo = {}
    try {
      userInfo = await getUserInfoFromMicrosoft(response.accessToken)
    } catch (graphError) {
      // Si falla Graph API, usar datos básicos de MSAL
      userInfo = {
        email: response.account.username || response.account.userPrincipalName || '',
        name: response.account.name || '',
      }
    }

    // Asegurar que todos los campos requeridos tengan valores
    const provider = 'microsoft'
    // Priorizar el id de Microsoft Graph API, luego los IDs de MSAL
    const provider_id = userInfo.id || userInfo.provider_id || response.account.id || response.account.homeAccountId || response.account.localAccountId || ''
    const email = userInfo.email || userInfo.mail || response.account.username || response.account.userPrincipalName || ''
    const username = userInfo.username || generateUsername(
      userInfo.name || response.account.name || '',
      userInfo.paternal_lastname || '',
      userInfo.maternal_lastname || '',
      email
    ) || (email ? email.split('@')[0] : 'user')
    const name = userInfo.name || response.account.name || ''
    const paternal_lastname = userInfo.paternal_lastname || ''
    const maternal_lastname = userInfo.maternal_lastname || ''

    // Validar campos requeridos
    if (!provider_id || !email || !username) {
      throw new Error('No se pudieron obtener todos los datos requeridos de Microsoft')
    }

    return {
      provider,
      provider_id,
      email,
      username,
      name,
      paternal_lastname,
      maternal_lastname,
      accessToken: response.accessToken,
      account: response.account,
    }
  } catch (error) {
    console.error('Error en login con Microsoft:', error)
    throw new Error(`Error al autenticar con Microsoft: ${error.message}`)
  }
}

/**
 * Inicia el flujo de login con Microsoft usando redirect
 * @returns {Promise<void>}
 */
export const loginWithMicrosoftRedirect = async () => {
  try {
    const msal = await getMsalInstance()
    await msal.loginRedirect(loginRequest)
  } catch (error) {
    console.error('Error en redirect con Microsoft:', error)
    throw new Error(`Error al redirigir a Microsoft: ${error.message}`)
  }
}

/**
 * Maneja la respuesta del redirect de Microsoft
 * @returns {Promise<Object|null>} Datos del usuario o null si no hay respuesta
 */
export const handleMicrosoftRedirect = async () => {
  try {
    const msal = await getMsalInstance()
    const response = await msal.handleRedirectPromise()

    if (response) {
      let userInfo = {}
      try {
        userInfo = await getUserInfoFromMicrosoft(response.accessToken)
      } catch (graphError) {
        // Si falla Graph API, usar datos básicos de MSAL
        userInfo = {
          email: response.account.username || response.account.userPrincipalName || '',
          name: response.account.name || '',
        }
      }

      // Asegurar que todos los campos requeridos tengan valores
      const provider = 'microsoft'
      // Priorizar el id de Microsoft Graph API, luego los IDs de MSAL
      const provider_id = userInfo.id || userInfo.provider_id || response.account.id || response.account.homeAccountId || response.account.localAccountId || ''
      const email = userInfo.email || userInfo.mail || response.account.username || response.account.userPrincipalName || ''
      const username = userInfo.username || generateUsername(
        userInfo.name || response.account.name || '',
        userInfo.paternal_lastname || '',
        userInfo.maternal_lastname || '',
        email
      ) || (email ? email.split('@')[0] : 'user')
      const name = userInfo.name || response.account.name || ''
      const paternal_lastname = userInfo.paternal_lastname || ''
      const maternal_lastname = userInfo.maternal_lastname || ''

      // Validar campos requeridos
      if (!provider_id || !email || !username) {
        throw new Error('No se pudieron obtener todos los datos requeridos de Microsoft')
      }

      return {
        provider,
        provider_id,
        email,
        username,
        name,
        paternal_lastname,
        maternal_lastname,
        accessToken: response.accessToken,
        account: response.account,
      }
    }

    return null
  } catch (error) {
    console.error('Error al manejar redirect de Microsoft:', error)
    throw new Error(`Error al procesar respuesta de Microsoft: ${error.message}`)
  }
}

/**
 * Genera un username a partir del nombre y apellidos
 * @param {string} name - Nombre del usuario
 * @param {string} paternalLastname - Apellido paterno
 * @param {string} maternalLastname - Apellido materno
 * @param {string} email - Email como fallback
 * @returns {string} Username generado
 */
const generateUsername = (name, paternalLastname, maternalLastname, email) => {
  // Intentar generar username a partir de nombre y apellidos
  const namePart = (name || '').trim().toLowerCase().replace(/\s+/g, '')
  const paternalPart = (paternalLastname || '').trim().toLowerCase().replace(/\s+/g, '')
  const maternalPart = (maternalLastname || '').trim().toLowerCase().replace(/\s+/g, '')
  
  if (namePart && paternalPart) {
    return `${namePart}${paternalPart}${maternalPart}`.toLowerCase()
  }
  
  // Fallback: usar email sin dominio
  if (email) {
    return email.split('@')[0].toLowerCase()
  }
  
  return 'user'
}

/**
 * Divide el surname de Microsoft en apellido paterno y materno
 * @param {string} surname - Apellidos completos (ej: "RAMOS LIMAS")
 * @returns {Object} { paternal_lastname, maternal_lastname }
 */
const splitSurname = (surname) => {
  if (!surname || !surname.trim()) {
    return { paternal_lastname: '', maternal_lastname: '' }
  }

  const parts = surname.trim().split(/\s+/)
  
  if (parts.length === 1) {
    return { paternal_lastname: parts[0], maternal_lastname: '' }
  }
  
  // Si hay dos o más palabras, la primera es paterno y el resto materno
  return {
    paternal_lastname: parts[0],
    maternal_lastname: parts.slice(1).join(' '),
  }
}

/**
 * Obtiene información del usuario desde Microsoft Graph API
 * @param {string} accessToken - Token de acceso de Microsoft
 * @returns {Promise<Object>} Información del usuario procesada
 */
const getUserInfoFromMicrosoft = async (accessToken) => {
  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener información del usuario: ${response.status}`)
    }

    const userInfo = await response.json()
    
    // Procesar los datos según el formato esperado por el backend
    const { paternal_lastname, maternal_lastname } = splitSurname(userInfo.surname || '')
    const name = userInfo.givenName || userInfo.displayName?.split(',')[1]?.trim() || ''
    const email = userInfo.mail || userInfo.userPrincipalName || ''
    
    // Generar username
    const username = generateUsername(name, paternal_lastname, maternal_lastname, email)
    
    return {
      ...userInfo,
      name,
      paternal_lastname,
      maternal_lastname,
      email,
      username,
      provider_id: userInfo.id || userInfo.provider_id || '',
    }
  } catch (error) {
    console.error('Error al obtener información del usuario:', error)
    return {}
  }
}

/**
 * Cierra la sesión de Microsoft
 * @returns {Promise<void>}
 */
export const logoutMicrosoft = async () => {
  try {
    const msal = await getMsalInstance()
    const accounts = msal.getAllAccounts()

    if (accounts.length > 0) {
      await msal.logoutPopup({
        account: accounts[0],
      })
    }
  } catch (error) {
    console.error('Error al cerrar sesión con Microsoft:', error)
    throw new Error(`Error al cerrar sesión: ${error.message}`)
  }
}
