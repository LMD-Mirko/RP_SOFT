/**
 * Contexto global para la imagen de perfil del usuario
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as perfilService from '../../features/configuracion-general/modules/perfil/services/perfilService';

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false); // Flag para evitar peticiones concurrentes
  const loadingPromiseRef = useRef(null); // Referencia a la promesa de carga actual

  /**
   * Cargar la imagen de perfil del usuario
   * @param {boolean} forceReload - Si es true, fuerza la recarga
   */
  const loadProfileImage = async (forceReload = false) => {
    // Si ya hay una petición en curso, retornar la misma promesa
    if (isLoadingImage && loadingPromiseRef.current) {
      return loadingPromiseRef.current;
    }

    // Si ya tenemos una imagen y no se fuerza la recarga, retornar la existente
    if (profileImageUrl && !forceReload) {
      return profileImageUrl;
    }

    setIsLoadingImage(true);
    setLoading(true);

    const loadPromise = (async () => {
      try {
        // Verificar si hay usuario en localStorage
        const userData = localStorage.getItem('rpsoft_user');
        if (!userData) {
          setProfileImageUrl(null);
          return null;
        }

        // Revocar la URL anterior si existe para liberar memoria
        if (profileImageUrl && profileImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(profileImageUrl);
        }

        // Intentar cargar la imagen (forzar recarga si se solicita)
        const imageUrl = await perfilService.loadProfileImage(forceReload);
        setProfileImageUrl(imageUrl);
        return imageUrl;
      } catch (error) {
        console.warn('Error al cargar imagen de perfil:', error);
        setProfileImageUrl(null);
        return null;
      } finally {
        setIsLoadingImage(false);
        setLoading(false);
        loadingPromiseRef.current = null;
      }
    })();

    loadingPromiseRef.current = loadPromise;
    return loadPromise;
  };

  /**
   * Actualizar la imagen de perfil
   */
  const updateProfileImage = (newImageUrl) => {
    // Revocar la URL anterior si existe para liberar memoria
    if (profileImageUrl && profileImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(profileImageUrl);
    }
    setProfileImageUrl(newImageUrl);
  };

  /**
   * Limpiar la imagen de perfil
   */
  const clearProfileImage = () => {
    if (profileImageUrl && profileImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(profileImageUrl);
    }
    setProfileImageUrl(null);
  };

  // Cargar la imagen cuando el componente se monta
  useEffect(() => {
    loadProfileImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escuchar cambios en localStorage para detectar cambios de usuario
  useEffect(() => {
    let debounceTimer = null;
    
    const handleStorageChange = (e) => {
      if (e.key === 'rpsoft_user') {
        // Debounce para evitar múltiples llamadas
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
          if (e.newValue) {
            loadProfileImage(true);
          } else {
            clearProfileImage();
          }
        }, 300);
      }
    };

    // Escuchar eventos de storage (entre pestañas)
    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar eventos personalizados para cambios en la misma pestaña
    let customDebounceTimer = null;
    const handleCustomStorageChange = () => {
      // Debounce para evitar múltiples llamadas
      if (customDebounceTimer) {
        clearTimeout(customDebounceTimer);
      }
      customDebounceTimer = setTimeout(() => {
        const userData = localStorage.getItem('rpsoft_user');
        if (userData && !isLoadingImage) {
          // Solo forzar recarga si no hay una carga en curso
          loadProfileImage(true);
        } else if (!userData) {
          clearProfileImage();
        }
      }, 300);
    };

    // Escuchar eventos personalizados
    window.addEventListener('userProfileUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userProfileUpdated', handleCustomStorageChange);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (customDebounceTimer) {
        clearTimeout(customDebounceTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingImage]); // Incluir isLoadingImage en las dependencias

  return (
    <UserProfileContext.Provider
      value={{
        profileImageUrl,
        loading,
        loadProfileImage,
        updateProfileImage,
        clearProfileImage,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile debe usarse dentro de UserProfileProvider');
  }
  return context;
}

