/**
 * Servicio para gestionar el perfil del usuario autenticado
 */

import { get, post, patch } from '../../../services/methods';
import { BASE_URL } from '../../../services/baseUrl';
import { getAccessToken } from '../../../shared/utils/cookieHelper';

/**
 * Obtiene la URL completa de la foto de perfil
 * @param {string} photoUrl - URL relativa de la foto (ej: "/api/users/me/photo/view/")
 * @returns {string|null} URL completa de la imagen o null si no hay foto
 */
export const getProfileImageUrl = (photoUrl) => {
  if (!photoUrl) return null;

  // Si la URL ya es completa (empieza con http), usarla directamente
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }

  // Construir URL completa usando BASE_URL
  // BASE_URL ya incluye /api, así que solo necesitamos agregar la ruta sin /api
  const sanitizeBaseUrl = (url) => (url.endsWith('/') ? url.slice(0, -1) : url);
  
  // Si photoUrl empieza con /api/, removerlo porque BASE_URL ya lo incluye
  let cleanPhotoUrl = photoUrl;
  if (cleanPhotoUrl.startsWith('/api/')) {
    cleanPhotoUrl = cleanPhotoUrl.replace('/api/', '/');
  } else if (cleanPhotoUrl.startsWith('api/')) {
    cleanPhotoUrl = '/' + cleanPhotoUrl;
  } else if (!cleanPhotoUrl.startsWith('/')) {
    cleanPhotoUrl = '/' + cleanPhotoUrl;
  }

  return `${sanitizeBaseUrl(BASE_URL)}${cleanPhotoUrl}`;
};

/**
 * Obtiene la foto de perfil actual del usuario y la convierte a blob URL
 * @param {boolean} forceReload - Si es true, fuerza la recarga agregando un timestamp
 * @returns {Promise<string|null>} Blob URL de la imagen o null si no hay foto
 */
export const loadProfileImage = async (forceReload = false) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.warn('No hay token de autenticación para cargar la imagen');
      return null;
    }

    // Construir URL completa con timestamp para evitar caché
    const sanitizeBaseUrl = (url) => (url.endsWith('/') ? url.slice(0, -1) : url);
    // Siempre agregar timestamp para evitar caché del navegador
    const timestamp = Date.now();
    const imageUrl = `${sanitizeBaseUrl(BASE_URL)}/users/me/photo/view/?t=${timestamp}`;

    // Hacer la petición GET para obtener la imagen
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    // Manejar errores
    if (response.status === 401) {
      console.warn('Token expirado al cargar imagen');
      return null;
    }

    if (response.status === 404) {
      return null; // No hay foto de perfil
    }

    if (!response.ok) {
      console.error(`Error al cargar imagen: ${response.status}`);
      return null;
    }

    // Convertir a blob y crear blob URL
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    return blobUrl;
  } catch (error) {
    console.error('Error al cargar imagen de perfil:', error);
    return null;
  }
};

/**
 * Obtiene el perfil del usuario autenticado
 * @returns {Promise} Datos del usuario
 */
export const getMyProfile = async () => {
  try {
    const data = await get('users/me/');
    // Si hay photo_url, construir la URL completa
    if (data.photo_url) {
      data.photo_url = getProfileImageUrl(data.photo_url);
    }
    return data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil del usuario autenticado
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Usuario actualizado
 */
export const updateMyProfile = async (data) => {
  try {
    return await patch('users/me/', data);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};

/**
 * Cambia la contraseña del usuario autenticado
 * @param {Object} data - { old_password, new_password }
 * @returns {Promise} Resultado de la operación
 */
export const changePassword = async (data) => {
  try {
    return await post('users/me/password/', data);
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    throw error;
  }
};

/**
 * Obtiene el rol del usuario autenticado
 * @returns {Promise} Rol del usuario
 */
export const getMyRole = async () => {
  try {
    return await get('users/me/role/');
  } catch (error) {
    console.error('Error al obtener rol:', error);
    throw error;
  }
};

/**
 * Valida un archivo de imagen antes de subirlo
 * @param {File} file - Archivo a validar
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImageFile = (file) => {
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'No se seleccionó ningún archivo' };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Formato no permitido. Use JPG, PNG o WEBP' };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
    return { valid: false, error: `Archivo muy grande (${sizeInMB}MB). Máximo: 5MB` };
  }

  return { valid: true };
};

/**
 * Verifica si el usuario tiene una foto de perfil
 * @returns {Promise<boolean>} true si existe foto, false si no
 */
export const checkProfilePhotoExists = async () => {
  try {
    const imageUrl = await loadProfileImage();
    return imageUrl !== null;
  } catch (error) {
    return false;
  }
};

/**
 * Sube una foto de perfil para el usuario autenticado
 * Si ya existe una foto, usa PATCH para actualizarla
 * Si no existe, usa POST para crearla
 * Si PATCH falla con 404, intenta con POST
 * @param {File} file - Archivo de imagen
 * @param {boolean} hasExistingPhoto - Indica si el usuario ya tiene una foto de perfil
 * @returns {Promise} Datos con la URL de la foto
 */
export const uploadProfilePhoto = async (file, hasExistingPhoto = false) => {
  try {
    // Validar archivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('file', file);

    // Usar axios directamente para multipart/form-data
    const { default: axios } = await import('axios');
    const sanitizeBaseUrl = (url) => (url.endsWith('/') ? url.slice(0, -1) : url);
    const accessToken = getAccessToken();

    // Si se indica que hay foto existente, intentar PATCH primero
    // Si falla con 404, hacer POST como fallback
    if (hasExistingPhoto) {
      try {
        const response = await axios.patch(
          `${sanitizeBaseUrl(BASE_URL)}/users/me/photo/`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (patchError) {
        // Si PATCH falla con 404, significa que no hay foto, usar POST
        if (patchError.response?.status === 404) {
          console.log('No se encontró foto existente, usando POST para crear nueva');
          const response = await axios.post(
            `${sanitizeBaseUrl(BASE_URL)}/users/me/photo/upload/`,
            formData,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          return response.data;
        }
        // Si es otro error, lanzarlo
        throw patchError;
      }
    } else {
      // Si no hay foto existente, usar POST directamente
      const response = await axios.post(
        `${sanitizeBaseUrl(BASE_URL)}/users/me/photo/upload/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    console.error('Error al subir foto de perfil:', error);
    throw error;
  }
};

