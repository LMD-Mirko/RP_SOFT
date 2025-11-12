/**
 * Hook personalizado para manejar OAuth con Microsoft
 * Facilita el uso de OAuth en los componentes
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithMicrosoftPopup } from '../utils/microsoftOAuth';
import { oauthLogin, getUserRole } from '../services/auth.service';
import { setAuthTokens } from '../../../shared/utils/cookieHelper';
import { redirectByRole } from '../utils/redirectByRole';

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

      // Validar que todos los campos requeridos estén presentes
      if (!microsoftData.provider || !microsoftData.provider_id || !microsoftData.email || !microsoftData.username) {
        const missingFields = []
        if (!microsoftData.provider) missingFields.push('provider')
        if (!microsoftData.provider_id) missingFields.push('provider_id')
        if (!microsoftData.email) missingFields.push('email')
        if (!microsoftData.username) missingFields.push('username')
        throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`)
      }

      // 2. Enviar datos al backend
      const response = await oauthLogin({
        provider: microsoftData.provider,
        provider_id: microsoftData.provider_id,
        email: microsoftData.email,
        username: microsoftData.username,
        name: microsoftData.name || '',
        paternal_lastname: microsoftData.paternal_lastname || '',
        maternal_lastname: microsoftData.maternal_lastname || '',
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
            name: response.user.name || microsoftData.name,
            role: response.user.role || 'practicante',
            loginTime: new Date().toISOString(),
            provider: 'microsoft',
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


