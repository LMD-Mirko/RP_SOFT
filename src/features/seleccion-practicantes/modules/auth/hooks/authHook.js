import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, register as registerService, getUserRole } from '../services/authService';
import { setAuthTokens, clearAuthTokens } from '../../../shared/utils/cookieHelper';
import { redirectByRole } from '../utils/redirectByRole';

/**
 * Hook para manejar la autenticación
 * Proporciona funciones y estado para login y registro
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Realiza el login del usuario
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginService(credentials);
      
      // Guardar tokens en cookies
      if (response.tokens) {
        const accessToken = response.tokens.access;
        const refreshToken = response.tokens.refresh;
        if (accessToken) {
          setAuthTokens(accessToken, refreshToken);
        }
      } else if (response.access_token || response.token) {
        // Compatibilidad con formato anterior
        const token = response.access_token || response.token;
        setAuthTokens(token, null);
      }

      // Guardar datos del usuario
      if (response.user) {
        localStorage.setItem(
          'rpsoft_user',
          JSON.stringify({
            ...response.user,
            loginTime: new Date().toISOString(),
          })
        );
      }

      // Obtener el rol del usuario y redirigir
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
          // Redirigir según el rol
          redirectByRole(roleData, navigate);
        }
      } catch (roleError) {
        // Si falla obtener el rol, redirigir a dashboard por defecto
        navigate('/dashboard');
      }

      // Limpiar datos temporales
      localStorage.removeItem('rpsoft_selection_data');
      localStorage.removeItem('rpsoft_current_step');

      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Realiza el registro del usuario
   * @param {Object} userData - { email, password, name, paternal_lastname, maternal_lastname }
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerService(userData);
      
      // Guardar tokens en cookies
      if (response.tokens) {
        const accessToken = response.tokens.access;
        const refreshToken = response.tokens.refresh;
        if (accessToken) {
          setAuthTokens(accessToken, refreshToken);
        }
      } else if (response.access_token || response.token) {
        // Compatibilidad con formato anterior
        const token = response.access_token || response.token;
        setAuthTokens(token, null);
      }

      // Guardar datos del usuario
      if (response.user) {
        localStorage.setItem(
          'rpsoft_user',
          JSON.stringify({
            ...response.user,
            loginTime: new Date().toISOString(),
          })
        );
      }

      // Obtener el rol del usuario y redirigir
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
          // Redirigir según el rol
          redirectByRole(roleData, navigate);
        }
      } catch (roleError) {
        // Si falla obtener el rol, redirigir a dashboard por defecto
        navigate('/dashboard');
      }

      // Limpiar datos temporales
      localStorage.removeItem('rpsoft_selection_data');
      localStorage.removeItem('rpsoft_current_step');

      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar usuario';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = () => {
    clearAuthTokens();
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('rpsoft_user');
    navigate('/');
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
};

export default useAuth;

