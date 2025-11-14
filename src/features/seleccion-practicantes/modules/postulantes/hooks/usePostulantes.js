import { useState, useEffect, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as postulanteService from '../services';

/**
 * Hook para gestionar postulantes
 */
export const usePostulantes = (filters = {}) => {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const toast = useToast();
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  const loadPostulantes = async (page = 1, params = {}) => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    const requestParams = {
      page,
      page_size: params.page_size || pagination.page_size,
      ...filters,
      ...params,
    };
    
    const requestKey = `postulantes_${JSON.stringify(requestParams)}`;
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await postulanteService.getPostulantes(requestParams);
        setPostulantes(response.results || []);
        setPagination(prev => ({
          ...prev,
          page: response.pagination?.page || page,
          page_size: response.pagination?.page_size || requestParams.page_size || pagination.page_size,
          total: response.pagination?.total || response.total || 0,
        }));
        return response;
      } catch (err) {
        setError(err.message || 'Error al cargar postulantes');
        toast.error(err.message || 'Error al cargar postulantes');
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  };

  // El useEffect inicial se elimina porque ahora se llama desde el componente
  // useEffect(() => {
  //   loadPostulantes(1);
  // }, [filters.job_posting_id, filters.state]);

  const aceptarPostulante = async (id) => {
    try {
      await postulanteService.aceptarPostulante(id);
      await loadPostulantes(pagination.page);
      toast.success('Postulante aceptado exitosamente');
    } catch (err) {
      toast.error(err.message || 'Error al aceptar postulante');
      throw err;
    }
  };

  const rechazarPostulante = async (id) => {
    try {
      await postulanteService.rechazarPostulante(id);
      await loadPostulantes(pagination.page);
      toast.success('Postulante rechazado exitosamente');
    } catch (err) {
      toast.error(err.message || 'Error al rechazar postulante');
      throw err;
    }
  };

  return {
    postulantes,
    loading,
    error,
    pagination,
    loadPostulantes,
    aceptarPostulante,
    rechazarPostulante,
  };
};

