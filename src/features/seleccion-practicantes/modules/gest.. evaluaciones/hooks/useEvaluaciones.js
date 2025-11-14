import { useState, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as evaluacionService from '../services/evaluacionService';

export const useEvaluaciones = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  const loadEvaluaciones = async (params = {}) => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    const requestParams = {
      ...params,
      page: params.page || pagination.page,
      page_size: params.page_size || pagination.page_size,
    };
    
    const requestKey = `evaluation-attempts_${JSON.stringify(requestParams)}`;
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        // Cargar intentos de evaluación en lugar de evaluaciones
        const response = await evaluacionService.getEvaluationAttempts(requestParams);
        setEvaluaciones(response.results || []);
        setPagination({
          page: response.page || 1,
          page_size: response.page_size || 20,
          total: response.total || 0,
        });
        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Error al cargar evaluaciones';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  };

  const deleteEvaluacion = async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Eliminar intento de evaluación
      await evaluacionService.deleteEvaluationAttempt(id);
      toast.success('Evaluación eliminada correctamente');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al eliminar evaluación';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    evaluaciones,
    pagination,
    error,
    loadEvaluaciones,
    deleteEvaluacion,
  };
};

