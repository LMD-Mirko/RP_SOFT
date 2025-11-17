/**
 * Hook personalizado para manejar OAuth con GitHub
 * Facilita el uso de OAuth en los componentes
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthLogin, getUserRole } from '../services/authService';
import { setAuthTokens } from '../../../shared/utils/cookieHelper';
import { redirectByRole } from '../utils/redirectByRole';

/**
 * Hook para manejar OAuth con GitHub
 * @returns {Object} Funciones y estados para OAuth
 */
export const useGitHubOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Maneja el login/registro con GitHub
   * @param {Function} onSuccess - Callback opcional cuando el login es exitoso
   * @param {number} roleId - ID del rol a asignar (1 para postulante, 2 para admin)
   */
  const handleGitHubAuth = useCallback(async (onSuccess, roleId = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Autenticar con GitHub
      const githubData = await loginWithGitHub();

      // Validar que todos los campos requeridos estén presentes
      if (!githubData.provider || !githubData.provider_id || !githubData.email) {
        const missingFields = []
        if (!githubData.provider) missingFields.push('provider')
        if (!githubData.provider_id) missingFields.push('provider_id')
        if (!githubData.email) missingFields.push('email')
        throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`)
      }
      
      // Guardar role_id en sessionStorage para el callback (si se usa redirect)
      sessionStorage.setItem('oauth_role_id', roleId.toString())

      // 2. Enviar datos al backend con role_id
      const response = await oauthLogin({
        provider: githubData.provider,
        provider_id: githubData.provider_id,
        email: githubData.email,
        name: githubData.name || '',
        paternal_lastname: githubData.paternal_lastname || '',
        maternal_lastname: githubData.maternal_lastname || '',
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

      // 6. Limpiar datos temporales
      localStorage.removeItem('rpsoft_selection_data');
      localStorage.removeItem('rpsoft_current_step');
      sessionStorage.removeItem('oauth_role_id');

      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al autenticar con GitHub';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [navigate]);

  return {
    handleGitHubAuth,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};

/**
 * Inicia el flujo de login con GitHub usando OAuth redirect
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const loginWithGitHub = async () => {
  return new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    
    if (!clientId) {
      reject(new Error('VITE_GITHUB_CLIENT_ID no está configurado en el archivo .env'));
      return;
    }

    // Generar un state aleatorio para seguridad
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('github_oauth_state', state);
    sessionStorage.setItem('github_oauth_resolve', JSON.stringify({ resolve, reject }));

    // Construir la URL de autorización de GitHub
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'user:email';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

    // Redirigir a GitHub
    window.location.href = authUrl;
  });
};

