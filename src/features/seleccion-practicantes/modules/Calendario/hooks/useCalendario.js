/**
 * Hook para gestionar calendario y reuniones
 */

import { useState, useEffect } from 'react';
import { useToast } from '@shared/components/Toast';
import * as calendarioService from '../services';

export const useCalendario = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [reuniones, setReuniones] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Cargar reuniones
   */
  const loadReuniones = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await calendarioService.getReuniones(params);
      setReuniones(response.results || []);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al cargar reuniones';
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
   * Crear reunión
   */
  const createReunion = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await calendarioService.createReunion(data);
      toast.success('Reunión agendada exitosamente');
      await loadReuniones();
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al crear reunión';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar reunión
   */
  const updateReunion = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await calendarioService.updateReunion(id, data);
      toast.success('Reunión actualizada exitosamente');
      await loadReuniones();
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al actualizar reunión';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar reunión
   */
  const deleteReunion = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await calendarioService.deleteReunion(id);
      toast.success('Reunión eliminada exitosamente');
      await loadReuniones();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al eliminar reunión';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reuniones,
    error,
    loadReuniones,
    createReunion,
    updateReunion,
    deleteReunion,
  };
};

