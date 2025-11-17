/**
 * Hook para gestionar historial de actividades
 */

import { useState } from 'react';
import { useToast } from '@shared/components/Toast';
import * as historialService from '../services';

export const useHistorial = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true); // Iniciar en true para mostrar skeleton
  const [actividades, setActividades] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const [error, setError] = useState(null);

  /**
   * Cargar actividades
   */
  const loadActividades = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await historialService.getActividades({
        ...params,
        page: params.page || pagination.page,
        page_size: params.page_size || pagination.page_size,
      });
      setActividades(response.results || []);
      setPagination({
        page: response.page || 1,
        page_size: response.page_size || 20,
        total: response.total || 0,
      });
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al cargar actividades';
      setError(errorMessage);
      // Solo mostrar error si no es 404 (endpoint no existe aún)
      if (err.response?.status !== 404) {
        toast.error(errorMessage);
      }
      return { results: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar historial (elimina todos los registros)
   * ⚠️ Esta acción es irreversible
   */
  const limpiarHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await historialService.limpiarHistorial();
      // Recargar actividades después de limpiar
      await loadActividades();
      toast.success(`Historial limpiado exitosamente. ${response.deleted_count || 0} registros eliminados.`);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || err.message || 'Error al limpiar historial';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    actividades,
    pagination,
    error,
    loadActividades,
    limpiarHistorial,
  };
};

