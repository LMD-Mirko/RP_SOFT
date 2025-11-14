/**
 * Hook personalizado para manejar OAuth con Microsoft
 * Facilita el uso de OAuth en los componentes
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithMicrosoftPopup } from '../utils/microsoftOAuth';
import { oauthLogin, oauthRegister, getUserRole } from '../services/authService';
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
   * Maneja el login con Microsoft (solo provider y provider_id)
   * @param {Function} onSuccess - Callback opcional cuando el login es exitoso
   */
  const handleMicrosoftLogin = useCallback(async (onSuccess) => {
    setIsLoading(true);
    setError(null);

    try {
      const microsoftData = await loginWithMicrosoftPopup();

      if (!microsoftData.provider || !microsoftData.provider_id) {
        throw new Error('Faltan campos requeridos: provider o provider_id');
      }

      const response = await oauthLogin({
        provider: microsoftData.provider,
        provider_id: microsoftData.provider_id,
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

      try {
        const roleData = await getUserRole();
        if (roleData) {
          const userData = JSON.parse(localStorage.getItem('rpsoft_user') || '{}');
          localStorage.setItem(
            'rpsoft_user',
            JSON.stringify({
              ...userData,
              ...roleData,
              loginTime: new Date().toISOString(),
            })
          );
          
          if (onSuccess) {
            onSuccess(response);
          } else {
            redirectByRole(roleData, navigate);
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

  /**
   * Maneja el registro con Microsoft (envía todos los datos con role_id)
   * @param {Function} onSuccess - Callback opcional cuando el registro es exitoso
   * @param {number} roleId - ID del rol a asignar (1 para postulante, 2 para admin)
   */
  const handleMicrosoftRegister = useCallback(async (onSuccess, roleId = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const microsoftData = await loginWithMicrosoftPopup();

      if (!microsoftData.provider || !microsoftData.provider_id || !microsoftData.email) {
        const missingFields = []
        if (!microsoftData.provider) missingFields.push('provider')
        if (!microsoftData.provider_id) missingFields.push('provider_id')
        if (!microsoftData.email) missingFields.push('email')
        throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`)
      }

      const nameParts = (microsoftData.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastNameParts = nameParts.slice(1);
      const paternalLastname = lastNameParts[0] || '';
      const maternalLastname = lastNameParts.slice(1).join(' ') || '';
      const username = microsoftData.email.split('@')[0] || '';

      const response = await oauthRegister({
        provider: microsoftData.provider,
        provider_id: microsoftData.provider_id,
        email: microsoftData.email,
        name: firstName,
        paternal_lastname: paternalLastname,
        maternal_lastname: maternalLastname,
        username: username,
        role_id: roleId,
      });

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
        localStorage.setItem(
          'rpsoft_user',
          JSON.stringify({
            email: response.user.email || microsoftData.email,
            name: response.user.name || firstName,
            role: response.user.role || 'practicante',
            loginTime: new Date().toISOString(),
            provider: 'microsoft',
          })
        );
      }

      try {
        const roleData = await getUserRole();
        if (roleData) {
          const userData = JSON.parse(localStorage.getItem('rpsoft_user') || '{}');
          localStorage.setItem(
            'rpsoft_user',
            JSON.stringify({
              ...userData,
              ...roleData,
              loginTime: new Date().toISOString(),
            })
          );
          
          if (onSuccess) {
            onSuccess(response);
          } else {
            redirectByRole(roleData, navigate);
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

      localStorage.removeItem('rpsoft_selection_data');
      localStorage.removeItem('rpsoft_current_step');

      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar con Microsoft';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [navigate]);

  return {
    handleMicrosoftLogin,
    handleMicrosoftRegister,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};


