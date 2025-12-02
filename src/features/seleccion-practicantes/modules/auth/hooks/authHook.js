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
      
      // Limpiar marca de logout si existe
      sessionStorage.removeItem('rpsoft_logging_out')
      
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
        const userData = {
          ...response.user,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('rpsoft_user', JSON.stringify(userData));
        
        // Redirigir según role_id y postulant_status del usuario
        // Los datos ya vienen en response.user según la nueva API
        redirectByRole(response.user, navigate);
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
            redirectByRole(updatedUserData, navigate);
          } else {
            navigate('/dashboard');
          }
        } catch (roleError) {
          // Si falla obtener el rol, redirigir a dashboard por defecto
          navigate('/dashboard');
        }
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
      
      // Limpiar marca de logout si existe
      sessionStorage.removeItem('rpsoft_logging_out')
      
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
        const userData = {
          ...response.user,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('rpsoft_user', JSON.stringify(userData));
        
        // Redirigir según role_id y postulant_status del usuario
        // Los datos ya vienen en response.user según la nueva API
        redirectByRole(response.user, navigate);
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
            redirectByRole(updatedUserData, navigate);
          } else {
            navigate('/dashboard');
          }
        } catch (roleError) {
          // Si falla obtener el rol, redirigir a dashboard por defecto
          navigate('/dashboard');
        }
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
   * Cierra la sesión del usuario y limpia todo el almacenamiento
   */
  const logout = () => {
    // Limpiar tokens de cookies
    clearAuthTokens();
    
    // Limpiar todas las cookies
    const cookies = document.cookie.split(';')
    const domain = window.location.hostname
    const paths = ['/', '/seleccion-practicantes', '/configuracion', '/agente-integrador']
    
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      
      if (name) {
        const expiration = 'expires=Thu, 01 Jan 1970 00:00:00 UTC'
        paths.forEach(path => {
          document.cookie = `${name}=; ${expiration}; path=${path};`
          document.cookie = `${name}=; ${expiration}; path=${path}; domain=${domain};`
          document.cookie = `${name}=; ${expiration}; path=${path}; domain=.${domain};`
          document.cookie = `${name}=; ${expiration}; path=${path}; SameSite=Strict;`
          document.cookie = `${name}=; ${expiration}; path=${path}; SameSite=Lax;`
          document.cookie = `${name}=; ${expiration}; path=${path}; SameSite=None; Secure;`
        })
      }
    })

    // Limpiar localStorage
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('rpsoft_user')
      localStorage.removeItem('rpsoft_selection_data')
      localStorage.removeItem('rpsoft_current_step')
      
      // Limpiar todos los intentos de exámenes almacenados
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('exam_attempt_') || key.startsWith('rpsoft_') || key.startsWith('auth'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error al limpiar localStorage:', error)
    }

    // Limpiar sessionStorage
    try {
      sessionStorage.removeItem('authToken')
      sessionStorage.clear()
    } catch (error) {
      console.error('Error al limpiar sessionStorage:', error)
    }

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

