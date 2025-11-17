/**
 * Hook para gestionar usuarios (Solo Admin)
 */

import { useState, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as userService from '../services/userService';

export const useUsers = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true); // Iniciar en true para mostrar skeleton
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  /**
   * Listar usuarios
   */
  const loadUsers = async (params = {}) => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    const requestKey = `users_${JSON.stringify(params)}`;
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await userService.getUsers({
          ...params,
          page: params.page || pagination.page,
          page_size: params.page_size || pagination.page_size,
        });
        setUsers(response.results || []);
        setPagination({
          page: response.page || 1,
          page_size: response.page_size || 20,
          total: response.total || 0,
        });
        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Error al cargar usuarios';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  };

  /**
   * Obtener usuario por ID
   */
  const getUserById = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.getUserById(userId);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al obtener usuario';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear usuario
   */
  const createUser = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(data);
      toast.success('Usuario creado exitosamente');
      // Recargar lista
      await loadUsers();
      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al crear usuario';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar usuario
   */
  const updateUser = async (userId, data, partial = true) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await userService.updateUser(userId, data, partial);
      toast.success('Usuario actualizado exitosamente');
      // Recargar lista
      await loadUsers();
      return updated;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al actualizar usuario';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar usuario
   */
  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(userId);
      toast.success('Usuario eliminado exitosamente');
      // Recargar lista
      await loadUsers();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al eliminar usuario';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    users,
    pagination,
    error,
    loadUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};

