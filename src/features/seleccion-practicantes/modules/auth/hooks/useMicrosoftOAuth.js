/**
 * Hook personalizado para manejar OAuth con Microsoft
 * Facilita el uso de OAuth en los componentes
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithMicrosoftPopup } from '../utils/microsoftOAuth';
import { oauthLogin } from '../services/auth.service';
import { setAuthTokens } from '../../../shared/utils/cookieHelper';

/**
 * Hook para manejar OAuth con Microsoft
 * @returns {Object} Funciones y estados para OAuth
 */
export const useMicrosoftOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Maneja el login/registro con Microsoft
   * @param {Function} onSuccess - Callback opcional cuando el login es exitoso
   */
  const handleMicrosoftAuth = useCallback(async (onSuccess) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Autenticar con Microsoft
      const microsoftData = await loginWithMicrosoftPopup();

      // 2. Enviar datos al backend
      const response = await oauthLogin({
        provider: microsoftData.provider,
        provider_id: microsoftData.provider_id,
        email: microsoftData.email,
        username: microsoftData.username,
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
            email: response.user.email || microsoftData.email,
            username: response.user.username || microsoftData.username,
            role: response.user.role || 'practicante',
            loginTime: new Date().toISOString(),
            provider: 'microsoft',
          })
        );
      }

      // 4. Limpiar datos temporales
      localStorage.removeItem('rpsoft_selection_data');
      localStorage.removeItem('rpsoft_current_step');

      // 5. Navegar o ejecutar callback
      if (onSuccess) {
        onSuccess(response);
      } else {
        // Navegar según el rol
        const userData = response.user || JSON.parse(localStorage.getItem('rpsoft_user'));
        if (userData?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/seleccion-practicantes');
        }
      }

      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al autenticar con Microsoft';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [navigate]);

  return {
    handleMicrosoftAuth,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};


