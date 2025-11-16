import { useState, useEffect } from 'react';
import { useToast } from '@shared/components/Toast';
import * as convocatoriaService from '../services';

/**
 * Hook para obtener convocatorias públicas (sin autenticación)
 */
export const useConvocatoriasPublicas = (filters = {}) => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const loadConvocatorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        estado: 'abierta',
        ...filters,
      };
      const response = await convocatoriaService.getConvocatorias(params);
      setConvocatorias(response.results || []);
    } catch (err) {
      setError(err.message || 'Error al cargar convocatorias');
      toast.error(err.message || 'Error al cargar convocatorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConvocatorias();
  }, []);

  return {
    convocatorias,
    loading,
    error,
    reload: loadConvocatorias,
  };
};

