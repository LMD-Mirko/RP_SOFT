import { useState, useEffect, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import { getEstadisticasPracticantes } from '../services';

/**
 * Hook para obtener estadísticas de practicantes
 */
export const useEstadisticasPracticantes = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const isLoadingRef = useRef(false);

  const loadEstadisticas = async () => {
    if (isLoadingRef.current) {
      return;
    }

    return requestGuard('estadisticas_practicantes', async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const data = await getEstadisticasPracticantes();
        setEstadisticas(data);
        return data;
      } catch (err) {
        setError(err.message || 'Error al cargar estadísticas');
        // Solo mostrar toast si es un error crítico (no de conexión)
        const isConnectionError = err.status === 0 || 
                                err.message?.includes('Failed to fetch') ||
                                err.message?.includes('ERR_CONNECTION_REFUSED');
        
        if (!isConnectionError) {
          toast.error(
            'No se pudieron cargar las estadísticas. Por favor, recarga la página.',
            5000,
            'Error al cargar estadísticas'
          );
        }
        console.error('Error al cargar estadísticas de practicantes:', err);
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  };

  useEffect(() => {
    loadEstadisticas();
  }, []);

  return {
    estadisticas,
    loading,
    error,
    loadEstadisticas,
  };
};

