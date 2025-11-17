/**
 * Configuración de MSAL (Microsoft Authentication Library)
 * Configuración para OAuth con Microsoft Azure AD
 */

/**
 * Configuración de MSAL
 * Estas variables deben configurarse en el archivo .env
 */
export const msalConfig = {
  auth: {
    // Client ID de la aplicación registrada en Azure AD
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    // Tenant ID (puede ser 'common' para multi-tenant o un tenant específico)
    authority: import.meta.env.VITE_MICROSOFT_AUTHORITY || 'https://login.microsoftonline.com/common',
    // URI de redirección después de la autenticación
    // IMPORTANTE: Este URI debe coincidir EXACTAMENTE con el configurado en Azure AD
    // Si VITE_MICROSOFT_REDIRECT_URI está configurado, se usa ese valor exacto
    // Si no, se construye automáticamente desde window.location.origin
    redirectUri: import.meta.env.VITE_MICROSOFT_REDIRECT_URI || 
      (typeof window !== 'undefined' ? window.location.origin : ''),
  },
  cache: {
    cacheLocation: 'sessionStorage', // o 'localStorage'
    storeAuthStateInCookie: false,
  },
};

/**
 * Scopes (permisos) solicitados a Microsoft
 */
export const loginRequest = {
  scopes: ['User.Read'], // Permiso para leer el perfil del usuario
};

/**
 * Verifica si la configuración de MSAL está completa
 * @returns {boolean} true si la configuración está completa
 */
export const isMsalConfigured = () => {
  return !!msalConfig.auth.clientId;
};

