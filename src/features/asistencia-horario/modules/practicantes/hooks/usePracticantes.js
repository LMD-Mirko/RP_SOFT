import { useState, useRef, useCallback } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as practicantesService from '../services';

/**
 * Hook para gestionar practicantes
 */
export const usePracticantes = (filters = {}) => {
  const [practicantes, setPracticantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const toast = useToast();
  const isLoadingRef = useRef(false);

  const loadPracticantes = useCallback(async (page = 1, params = {}) => {
    if (isLoadingRef.current) {
      return;
    }

    const requestParams = {
      page: page || 1,
      ...filters,
      ...params,
    };

    // Mapear filtros del frontend a los del backend
    if (params.nombre) requestParams.nombre = params.nombre;
    if (params.correo) requestParams.correo = params.correo;
    if (params.estado) {
      // Mapear estados del frontend a los del backend
      const estadoMap = {
        'activo': 'activo',
        'recuperacion': 'en_recuperacion',
        'riesgo': 'en_riesgo',
        'inactivo': 'inactivo',
      };
      requestParams.estado = estadoMap[params.estado] || params.estado;
    }

    const requestKey = `practicantes_${JSON.stringify(requestParams)}`;

    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await practicantesService.getPracticantes(requestParams);
        // El backend puede devolver results (DRF) o data (custom)
        const practicantesData = (response && (response.results || response.data)) 
          ? (response.results || response.data)
          : [];
        setPracticantes(Array.isArray(practicantesData) ? practicantesData : []);
        setPagination(prev => ({
          ...prev,
          page: response.pagination?.page || page,
          page_size: response.pagination?.page_size || requestParams.page_size || pagination.page_size,
          total: response.pagination?.total || response.count || response.total || practicantesData.length,
        }));
        return response;
      } catch (err) {
        setError(err.message || 'Error al cargar practicantes');
        toast.error(err.message || 'Error al cargar practicantes');
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  }, [filters, pagination.page_size, toast]);

  const createPracticante = async (data) => {
    try {
      setLoading(true);
      const response = await practicantesService.createPracticante(data);
      await loadPracticantes(pagination.page);
      const message = response?.message || 'Practicante creado exitosamente';
      toast.success(message, 4000, '¡Practicante creado!');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al crear practicante';
      toast.error(errorMessage, 4000, 'Error al crear');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePracticante = async (id, data) => {
    try {
      setLoading(true);
      const response = await practicantesService.updatePracticante(id, data);
      await loadPracticantes(pagination.page);
      const message = response?.message || 'Practicante actualizado exitosamente';
      toast.success(message, 4000, '¡Practicante actualizado!');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar practicante';
      toast.error(errorMessage, 4000, 'Error al actualizar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePracticante = async (id) => {
    try {
      setLoading(true);
      await practicantesService.deletePracticante(id);
      await loadPracticantes(pagination.page);
      toast.success('Practicante eliminado exitosamente', 4000, '¡Practicante eliminado!');
    } catch (err) {
      const errorMessage = err.message || 'Error al eliminar practicante';
      toast.error(errorMessage, 4000, 'Error al eliminar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    practicantes,
    loading,
    error,
    pagination,
    loadPracticantes,
    createPracticante,
    updatePracticante,
    deletePracticante,
  };
};

