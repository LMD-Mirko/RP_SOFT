/**
 * Hook personalizado para manejar OAuth con Facebook
 * Facilita el uso de OAuth en los componentes
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthLogin, getUserRole } from '../services/authService';
import { setAuthTokens } from '../../../shared/utils/cookieHelper';
import { redirectByRole } from '../utils/redirectByRole';

/**
 * Hook para manejar OAuth con Facebook
 * @returns {Object} Funciones y estados para OAuth
 */
export const useFacebookOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Maneja el login/registro con Facebook
   * @param {Function} onSuccess - Callback opcional cuando el login es exitoso
   * @param {number} roleId - ID del rol a asignar (1 para postulante, 2 para admin)
   */
  const handleFacebookAuth = useCallback(async (onSuccess, roleId = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Autenticar con Facebook
      const facebookData = await loginWithFacebook();

      // Validar que todos los campos requeridos estén presentes
      if (!facebookData.provider || !facebookData.provider_id || !facebookData.email) {
        const missingFields = []
        if (!facebookData.provider) missingFields.push('provider')
        if (!facebookData.provider_id) missingFields.push('provider_id')
        if (!facebookData.email) missingFields.push('email')
        throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`)
      }
      
      // Guardar role_id en sessionStorage para el callback (si se usa redirect)
      sessionStorage.setItem('oauth_role_id', roleId.toString())

      // 2. Enviar datos al backend con role_id
      const response = await oauthLogin({
        provider: facebookData.provider,
        provider_id: facebookData.provider_id,
        email: facebookData.email,
        name: facebookData.name || '',
        paternal_lastname: facebookData.paternal_lastname || '',
        maternal_lastname: facebookData.maternal_lastname || '',
        role_id: roleId,
      });

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
        localStorage.setItem(
          'rpsoft_user',
          JSON.stringify({
            email: response.user.email || facebookData.email,
            name: response.user.name || facebookData.name,
            role: response.user.role || 'practicante',
            loginTime: new Date().toISOString(),
            provider: 'facebook',
          })
        );
      }

      // 4. Obtener el rol del usuario y redirigir
      try {
        const roleData = await getUserRole();
        if (roleData) {
          // Actualizar datos del usuario con información del rol
          const userData = JSON.parse(localStorage.getItem('rpsoft_user') || '{}');
          localStorage.setItem(
            'rpsoft_user',
            JSON.stringify({
              ...userData,
              ...roleData,
              loginTime: new Date().toISOString(),
            })
          );
          
          // 5. Navegar o ejecutar callback
          if (onSuccess) {
            onSuccess(response);
          } else {
            // Redirigir según el rol
            redirectByRole(roleData, navigate);
          }
        } else {
          // Si no hay datos de rol, redirigir a dashboard por defecto
          if (onSuccess) {
            onSuccess(response);
          } else {
            navigate('/dashboard');
          }
        }
      } catch (roleError) {
        // Si falla obtener el rol, redirigir a dashboard por defecto
        if (onSuccess) {
          onSuccess(response);
        } else {
          navigate('/dashboard');
        }
      }

      // 6. Limpiar datos temporales
      localStorage.removeItem('rpsoft_selection_data');
      localStorage.removeItem('rpsoft_current_step');
      sessionStorage.removeItem('oauth_role_id');

      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al autenticar con Facebook';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [navigate]);

  return {
    handleFacebookAuth,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};

/**
 * Inicia el flujo de login con Facebook usando OAuth redirect
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const loginWithFacebook = async () => {
  return new Promise((resolve, reject) => {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    
    if (!appId) {
      reject(new Error('VITE_FACEBOOK_APP_ID no está configurado en el archivo .env'));
      return;
    }

    // Generar un state aleatorio para seguridad
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('facebook_oauth_state', state);
    sessionStorage.setItem('facebook_oauth_resolve', JSON.stringify({ resolve, reject }));

    // Construir la URL de autorización de Facebook
    const redirectUri = `${window.location.origin}/auth/facebook/callback`;
    const scope = 'email,public_profile';
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&response_type=code`;

    // Redirigir a Facebook
    window.location.href = authUrl;
  });
};

