/**
 * Hook personalizado para manejar OAuth con Google
 * Facilita el uso de OAuth en los componentes
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthLogin, oauthRegister, getUserRole } from '../services/authService';
import { setAuthTokens } from '../../../shared/utils/cookieHelper';
import { redirectByRole } from '../utils/redirectByRole';
import { getEnvVar } from '@shared/utils/envConfig';

/**
 * Hook para manejar OAuth con Google
 * @returns {Object} Funciones y estados para OAuth
 */
export const useGoogleOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Maneja el login con Google (solo provider y provider_id)
   * @param {Function} onSuccess - Callback opcional cuando el login es exitoso
   */
  const handleGoogleLogin = useCallback(async (onSuccess) => {
    setIsLoading(true);
    setError(null);

    try {
      const googleData = await loginWithGoogle();

      if (!googleData.provider || !googleData.provider_id) {
        throw new Error('Faltan campos requeridos: provider o provider_id');
      }

      const response = await oauthLogin({
        provider: googleData.provider,
        provider_id: googleData.provider_id,
      });

      // Limpiar marca de logout si existe
      sessionStorage.removeItem('rpsoft_logging_out')

      // 3. Guardar tokens en cookies
      if (response.tokens) {
        const accessToken = response.tokens.access;
        const refreshToken = response.tokens.refresh;
        if (accessToken) {
          setAuthTokens(accessToken, refreshToken);
        }
      } else if (response.token) {
        // Compatibilidad con formato anterior
        setAuthTokens(response.token, null);
      }

      if (response.user) {
        const userData = {
          ...response.user,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('rpsoft_user', JSON.stringify(userData));
        
        // Redirigir según role_id y postulant_status del usuario
        // Los datos ya vienen en response.user según la nueva API
        if (onSuccess) {
          onSuccess(response);
        } else {
          redirectByRole(response.user, navigate);
        }
      } else {
        // Fallback: intentar obtener datos del rol si no vienen en response.user
        try {
          const roleData = await getUserRole();
          if (roleData) {
            const userData = JSON.parse(localStorage.getItem('rpsoft_user') || '{}');
            const updatedUserData = {
              ...userData,
              ...roleData,
              loginTime: new Date().toISOString(),
            };
            localStorage.setItem('rpsoft_user', JSON.stringify(updatedUserData));
            if (onSuccess) {
              onSuccess(response);
            } else {
              redirectByRole(updatedUserData, navigate);
            }
          } else {
            if (onSuccess) {
              onSuccess(response);
            } else {
              navigate('/dashboard');
            }
          }
        } catch (roleError) {
          if (onSuccess) {
            onSuccess(response);
          } else {
            navigate('/dashboard');
          }
        }
      }

      localStorage.removeItem('rpsoft_selection_data');
      localStorage.removeItem('rpsoft_current_step');

      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al autenticar con Google';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [navigate]);

  /**
   * Maneja el registro con Google (envía todos los datos con role_id)
   * @param {Function} onSuccess - Callback opcional cuando el registro es exitoso
   * @param {number} roleId - ID del rol a asignar (1 para postulante, 2 para admin)
   */
  const handleGoogleRegister = useCallback(async (onSuccess, roleId = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const googleData = await loginWithGoogle();

      if (!googleData.provider || !googleData.provider_id || !googleData.email) {
        const missingFields = []
        if (!googleData.provider) missingFields.push('provider')
        if (!googleData.provider_id) missingFields.push('provider_id')
        if (!googleData.email) missingFields.push('email')
        throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`)
      }

      const username = googleData.email.split('@')[0] || '';

      const response = await oauthRegister({
        provider: googleData.provider,
        provider_id: googleData.provider_id,
        email: googleData.email,
        name: googleData.name || '',
        paternal_lastname: googleData.paternal_lastname || '',
        maternal_lastname: googleData.maternal_lastname || '',
        username: username,
        role_id: roleId,
      });

      // Limpiar marca de logout si existe
      sessionStorage.removeItem('rpsoft_logging_out')

      if (response.tokens) {
        const accessToken = response.tokens.access;
        const refreshToken = response.tokens.refresh;
        if (accessToken) {
          setAuthTokens(accessToken, refreshToken);
        }
      } else if (response.token) {
        setAuthTokens(response.token, null);
      }

      if (response.user) {
        const userData = {
          ...response.user,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('rpsoft_user', JSON.stringify(userData));
        
        // Redirigir según role_id y postulant_status del usuario
        // Los datos ya vienen en response.user según la nueva API
        if (onSuccess) {
          onSuccess(response);
        } else {
          redirectByRole(response.user, navigate);
        }
      } else {
        // Fallback: intentar obtener datos del rol si no vienen en response.user
        try {
          const roleData = await getUserRole();
          if (roleData) {
            const userData = JSON.parse(localStorage.getItem('rpsoft_user') || '{}');
            const updatedUserData = {
              ...userData,
              ...roleData,
              loginTime: new Date().toISOString(),
            };
            localStorage.setItem('rpsoft_user', JSON.stringify(updatedUserData));
            if (onSuccess) {
              onSuccess(response);
            } else {
              redirectByRole(updatedUserData, navigate);
            }
          } else {
            if (onSuccess) {
              onSuccess(response);
            } else {
              navigate('/dashboard');
            }
          }
        } catch (roleError) {
          if (onSuccess) {
            onSuccess(response);
          } else {
            navigate('/dashboard');
          }
        }
      }

      localStorage.removeItem('rpsoft_selection_data');
      localStorage.removeItem('rpsoft_current_step');

      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar con Google';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [navigate]);

  return {
    handleGoogleLogin,
    handleGoogleRegister,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};

/**
 * Inicia el flujo de login con Google usando Google Identity Services
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const loginWithGoogle = async () => {
  return new Promise((resolve, reject) => {
    const clientId = getEnvVar('VITE_GOOGLE_CLIENT_ID');
    
    if (!clientId) {
      reject(new Error('VITE_GOOGLE_CLIENT_ID no está configurado. Configúralo en Variables de Entorno.'));
      return;
    }

    // Cargar Google Identity Services si no está cargado
    const loadGoogleScript = () => {
      return new Promise((scriptResolve, scriptReject) => {
        if (window.google && window.google.accounts) {
          scriptResolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && window.google.accounts) {
            scriptResolve();
          } else {
            scriptReject(new Error('Google Identity Services no se cargó correctamente'));
          }
        };
        script.onerror = () => {
          scriptReject(new Error('Error al cargar Google Identity Services'));
        };
        document.head.appendChild(script);
      });
    };

    loadGoogleScript()
      .then(() => {
        try {
          // Usar OAuth 2.0 Token Client para obtener access token
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                reject(new Error(tokenResponse.error));
                return;
              }
              
              // Obtener información del usuario con el access token
              try {
                await getUserInfoFromGoogle(tokenResponse.access_token, resolve, reject);
              } catch (error) {
                reject(error);
              }
            },
          });

          // Solicitar el token
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (error) {
          reject(new Error(`Error al inicializar Google Auth: ${error.message}`));
        }
      })
      .catch(reject);
  });
};

/**
 * Obtiene información del usuario desde Google usando el access token
 */
const getUserInfoFromGoogle = async (accessToken, resolve, reject) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener información del usuario: ${response.status}`);
    }

    const userInfo = await response.json();
    
    const provider = 'google';
    const provider_id = userInfo.id || '';
    const email = userInfo.email || '';
    const name = userInfo.given_name || userInfo.name || '';
    
    // Intentar dividir el nombre en nombre y apellidos
    const paternalLastname = userInfo.family_name || '';
    const maternalLastname = '';

    if (!provider_id || !email) {
      reject(new Error('No se pudieron obtener todos los datos requeridos de Google'));
      return;
    }

    resolve({
      provider,
      provider_id,
      email,
      name,
      paternal_lastname: paternalLastname,
      maternal_lastname: maternalLastname,
    });
  } catch (error) {
    reject(new Error(`Error al obtener información del usuario: ${error.message}`));
  }
};

