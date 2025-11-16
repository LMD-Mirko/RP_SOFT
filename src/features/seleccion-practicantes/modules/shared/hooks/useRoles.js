/**
 * Hook para gestionar roles (Solo Admin)
 */

import { useState, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as roleService from '../services/roleService';

export const useRoles = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true); // Iniciar en true para mostrar skeleton
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  /**
   * Listar roles
   */
  const loadRoles = async (params = {}) => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    const requestKey = `roles_${JSON.stringify(params)}`;
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await roleService.getRoles({
          ...params,
          page: params.page || pagination.page,
          page_size: params.page_size || pagination.page_size,
        });
        setRoles(response.results || []);
        setPagination({
          page: response.page || 1,
          page_size: response.page_size || 20,
          total: response.total || 0,
        });
        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Error al cargar roles';
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
   * Obtener rol por ID
   */
  const getRoleById = async (roleId) => {
    setLoading(true);
    setError(null);
    try {
      const role = await roleService.getRoleById(roleId);
      return role;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al obtener rol';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear rol
   */
  const createRole = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const newRole = await roleService.createRole(data);
      toast.success('Rol creado exitosamente');
      await loadRoles();
      return newRole;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al crear rol';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar rol
   */
  const updateRole = async (roleId, data, partial = true) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await roleService.updateRole(roleId, data, partial);
      toast.success('Rol actualizado exitosamente');
      await loadRoles();
      return updated;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al actualizar rol';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar rol
   */
  const deleteRole = async (roleId) => {
    setLoading(true);
    setError(null);
    try {
      await roleService.deleteRole(roleId);
      toast.success('Rol eliminado exitosamente');
      await loadRoles();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al eliminar rol';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    roles,
    pagination,
    error,
    loadRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
  };
};

