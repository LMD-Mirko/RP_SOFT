import { useState, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as evaluacionService from '../services/evaluacionService';

export const useEvaluaciones = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true); // Iniciar en true para mostrar skeleton
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  const loadEvaluaciones = async () => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }
    
    const requestKey = 'evaluations';
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        // Cargar evaluaciones (sin paginación)
        const response = await evaluacionService.getEvaluaciones();
        // Si la respuesta es un array, usarlo directamente
        const evaluacionesList = Array.isArray(response) ? response : (response.results || []);
        setEvaluaciones(evaluacionesList);
        setPagination({
          page: 1,
          page_size: evaluacionesList.length,
          total: evaluacionesList.length,
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
      // Eliminar evaluación
      await evaluacionService.deleteEvaluacion(id);
      toast.success('Evaluación eliminada correctamente');
      // Recargar evaluaciones después de eliminar
      await loadEvaluaciones();
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

