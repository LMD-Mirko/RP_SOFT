/**
 * Hook para gestionar el perfil del usuario
 */

import { useState } from 'react';
import { useToast } from '@shared/components/Toast';
import { useUserProfile } from '@shared/context/UserProfileContext';
import * as perfilService from '../services/perfilService';

export const useProfile = () => {
  const toast = useToast();
  const { updateProfileImage, profileImageUrl: contextImageUrl, loadProfileImage: loadImageFromContext } = useUserProfile();
  const [loading, setLoading] = useState(true); // Iniciar en true para mostrar skeleton
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Cargar perfil del usuario
   */
  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await perfilService.getMyProfile();
      setProfile(data);
      
      // Si hay foto en el perfil, cargar la imagen desde el contexto
      if (data.photo_url) {
        // El contexto se encargará de cargar la imagen
        // Solo esperamos un momento para que se actualice
        setTimeout(() => {
          loadImageFromContext(true);
        }, 100);
      } else {
        updateProfileImage(null);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al cargar perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar perfil
   */
  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await perfilService.updateMyProfile(data);
      // Recargar el perfil completo para obtener todos los campos actualizados
      const updated = await loadProfile();
      toast.success('Perfil actualizado exitosamente');
      return updated;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al actualizar perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambiar contraseña
   */
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      await perfilService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('Contraseña actualizada exitosamente');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al cambiar contraseña';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Solicitar cambio de email
   */
  const requestChangeEmail = async (newEmail) => {
    setLoading(true);
    setError(null);
    try {
      const result = await perfilService.requestChangeEmail(newEmail);
      toast.success(result.message || 'Código de verificación enviado a tu email actual');
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al solicitar cambio de email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Confirmar cambio de email
   */
  const confirmChangeEmail = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const result = await perfilService.confirmChangeEmail(code);
      toast.success(result.message || 'Email actualizado exitosamente');
      // Recargar perfil para obtener el nuevo email
      await loadProfile();
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al confirmar cambio de email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener rol del usuario
   */
  const getRole = async () => {
    try {
      return await perfilService.getMyRole();
    } catch (err) {
      console.error('Error al obtener rol:', err);
      throw err;
    }
  };

  /**
   * Subir foto de perfil
   */
  const uploadPhoto = async (file) => {
    setLoading(true);
    setError(null);
    try {
      // Verificar si el usuario realmente tiene una foto de perfil
      // Intentando cargarla primero para confirmar que existe
      let hasExistingPhoto = false;
      if (profile?.photo_url || contextImageUrl) {
        try {
          hasExistingPhoto = await perfilService.checkProfilePhotoExists();
        } catch (error) {
          // Si falla al verificar, asumir que no hay foto
          hasExistingPhoto = false;
        }
      }
      
      // Subir o actualizar la foto según corresponda
      // El servicio manejará el fallback de PATCH a POST si es necesario
      const result = await perfilService.uploadProfilePhoto(file, hasExistingPhoto);
      
      // Actualizar el perfil con la nueva foto
      if (result.user) {
        // Construir la URL completa de la foto
        if (result.user.photo_url) {
          result.user.photo_url = perfilService.getProfileImageUrl(result.user.photo_url);
        }
        setProfile(result.user);
      } else if (result.photo_url) {
        const photoUrl = perfilService.getProfileImageUrl(result.photo_url);
        setProfile(prev => ({ ...prev, photo_url: photoUrl }));
      }
      
      // Esperar un momento para que el servidor procese la imagen
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Disparar evento para que el contexto global recargue la imagen
      // El contexto manejará la recarga de forma controlada (con debounce y protección contra duplicados)
      window.dispatchEvent(new Event('userProfileUpdated'));
      
      // El contexto se encargará de actualizar la imagen en todos los componentes
      // No necesitamos hacer nada más aquí
      
      toast.success(hasExistingPhoto ? 'Foto de perfil actualizada exitosamente' : 'Foto de perfil subida exitosamente');
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Error al subir foto de perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profile,
    profileImageUrl: contextImageUrl, // Usar la imagen del contexto global
    error,
    loadProfile,
    updateProfile,
    changePassword,
    requestChangeEmail,
    confirmChangeEmail,
    getRole,
    uploadPhoto,
  };
};

