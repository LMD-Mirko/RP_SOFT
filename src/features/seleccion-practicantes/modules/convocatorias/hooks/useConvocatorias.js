import { useState, useEffect, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as convocatoriaService from '../services';

/**
 * Hook para gestionar convocatorias
 */
export const useConvocatorias = (filters = {}) => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const toast = useToast();
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  const loadConvocatorias = async (page = 1) => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    const params = {
      page,
      page_size: pagination.page_size,
      ...filters,
    };
    
    const requestKey = `convocatorias_${JSON.stringify(params)}`;
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await convocatoriaService.getConvocatorias(params);
        setConvocatorias(response.results || []);
        setPagination(prev => ({
          ...prev,
          page,
          total: response.total || 0,
        }));
        return response;
      } catch (err) {
        setError(err.message || 'Error al cargar convocatorias');
        toast.error(err.message || 'Error al cargar convocatorias');
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  };

  useEffect(() => {
    loadConvocatorias(1);
  }, [filters.estado, filters.status]);

  const createConvocatoria = async (data) => {
    try {
      const newConvocatoria = await convocatoriaService.createConvocatoria(data);
      setConvocatorias(prev => [newConvocatoria, ...prev]);
      toast.success('Convocatoria creada exitosamente');
      return newConvocatoria;
    } catch (err) {
      toast.error(err.message || 'Error al crear convocatoria');
      throw err;
    }
  };

  const updateConvocatoria = async (id, data) => {
    try {
      const updated = await convocatoriaService.updateConvocatoria(id, data);
      setConvocatorias(prev =>
        prev.map(c => (c.id === id ? updated : c))
      );
      toast.success('Convocatoria actualizada exitosamente');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Error al actualizar convocatoria');
      throw err;
    }
  };

  const cerrarConvocatoria = async (id) => {
    try {
      await convocatoriaService.cerrarConvocatoria(id);
      await loadConvocatorias(pagination.page);
      toast.success('Convocatoria cerrada exitosamente');
    } catch (err) {
      toast.error(err.message || 'Error al cerrar convocatoria');
      throw err;
    }
  };

  const deleteConvocatoria = async (id) => {
    try {
      await convocatoriaService.deleteConvocatoria(id);
      setConvocatorias(prev => prev.filter(c => c.id !== id));
      toast.success('Convocatoria eliminada exitosamente');
    } catch (err) {
      toast.error(err.message || 'Error al eliminar convocatoria');
      throw err;
    }
  };

  return {
    convocatorias,
    loading,
    error,
    pagination,
    loadConvocatorias,
    createConvocatoria,
    updateConvocatoria,
    cerrarConvocatoria,
    deleteConvocatoria,
  };
};

