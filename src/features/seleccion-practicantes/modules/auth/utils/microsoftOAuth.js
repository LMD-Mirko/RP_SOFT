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

    const userInfo = await getUserInfoFromMicrosoft(response.accessToken)

    return {
      provider: 'microsoft',
      provider_id: response.account.homeAccountId || response.account.localAccountId,
      email: response.account.username || userInfo.mail || userInfo.userPrincipalName,
      username: userInfo.displayName || response.account.name || response.account.username,
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
      const userInfo = await getUserInfoFromMicrosoft(response.accessToken)

      return {
        provider: 'microsoft',
        provider_id: response.account.homeAccountId || response.account.localAccountId,
        email: response.account.username || userInfo.mail || userInfo.userPrincipalName,
        username: userInfo.displayName || response.account.name || response.account.username,
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
 * Obtiene información del usuario desde Microsoft Graph API
 * @param {string} accessToken - Token de acceso de Microsoft
 * @returns {Promise<Object>} Información del usuario
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

    return await response.json()
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
