/**
 * Helper para manejar cookies de tokens de autenticación
 * 
 * IMPORTANTE: Este helper SOLO maneja 2 cookies:
 * - access_token: Token de acceso del backend
 * - refresh_token: Token de refresh del backend
 * 
 * Las demás cookies que puedas ver (de login.microsoftonline.com) son
 * creadas automáticamente por Microsoft durante el proceso OAuth y
 * NO son gestionadas por este helper.
 */

const COOKIE_OPTIONS = {
  expires: 7, // 7 días
  path: '/',
  sameSite: 'strict',
  secure: window.location.protocol === 'https:',
};

/**
 * Establece una cookie
 * @param {string} name - Nombre de la cookie
 * @param {string} value - Valor de la cookie
 * @param {Object} options - Opciones de la cookie
 */
export const setCookie = (name, value, options = {}) => {
  const opts = { ...COOKIE_OPTIONS, ...options };
  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (opts.expires) {
    const date = new Date();
    date.setTime(date.getTime() + opts.expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }

  if (opts.sameSite) {
    cookieString += `; SameSite=${opts.sameSite}`;
  }

  if (opts.secure) {
    cookieString += `; Secure`;
  }

  document.cookie = cookieString;
};

/**
 * Obtiene el valor de una cookie
 * @param {string} name - Nombre de la cookie
 * @returns {string|null} Valor de la cookie o null si no existe
 */
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
};

/**
 * Elimina una cookie
 * @param {string} name - Nombre de la cookie
 * @param {Object} options - Opciones de la cookie
 */
export const removeCookie = (name, options = {}) => {
  const opts = { ...COOKIE_OPTIONS, ...options };
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${opts.path}; SameSite=${opts.sameSite}`;
};

/**
 * Guarda los tokens de acceso y refresh en cookies
 * @param {string} accessToken - Token de acceso
 * @param {string|null|undefined} refreshToken - Token de refresh (opcional)
 */
export const setAuthTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    setCookie('access_token', accessToken);
  }
  if (refreshToken) {
    setCookie('refresh_token', refreshToken);
  }
};

/**
 * Obtiene el token de acceso de las cookies
 * @returns {string|null} Token de acceso o null
 */
export const getAccessToken = () => {
  return getCookie('access_token');
};

/**
 * Obtiene el token de refresh de las cookies
 * @returns {string|null} Token de refresh o null
 */
export const getRefreshToken = () => {
  return getCookie('refresh_token');
};

/**
 * Elimina los tokens de autenticación de las cookies
 */
export const clearAuthTokens = () => {
  removeCookie('access_token');
  removeCookie('refresh_token');
};

