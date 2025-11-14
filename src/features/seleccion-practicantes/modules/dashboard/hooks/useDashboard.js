import { useState, useEffect, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as dashboardService from '../services';

/**
 * Hook para obtener estadísticas del dashboard
 */
export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [convocatoriaStats, setConvocatoriaStats] = useState(null);
  const [myProgress, setMyProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  const loadStats = async () => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    return requestGuard('dashboard_stats', async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getStats();
        setStats(data);
        return data;
      } catch (err) {
        setError(err.message || 'Error al cargar estadísticas');
        toast.error(err.message || 'Error al cargar estadísticas');
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  };

  const loadConvocatoriaStats = async (convocatoriaId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getConvocatoriaStats(convocatoriaId);
      setConvocatoriaStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar estadísticas de convocatoria');
      toast.error(err.message || 'Error al cargar estadísticas de convocatoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMyProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getMyProgress();
      setMyProgress(data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar progreso');
      toast.error(err.message || 'Error al cargar progreso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadPostulanteProgress = async (postulantId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getPostulanteProgress(postulantId);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar progreso del postulante');
      toast.error(err.message || 'Error al cargar progreso del postulante');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadUsersActivity = async (params = {}) => {
    const requestParams = {
      ...params,
      page_size: params.page_size || 10,
    };
    const requestKey = `users_activity_${JSON.stringify(requestParams)}`;
    
    return requestGuard(requestKey, async () => {
      try {
        const data = await dashboardService.getUsersActivity(requestParams);
        return data;
      } catch (err) {
        console.error('Error al cargar actividad de usuarios:', err);
        // No mostrar error al usuario, solo retornar array vacío
        return { results: [], total: 0 };
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    
    const initialLoad = async () => {
      if (mounted && !isLoadingRef.current && !stats) {
        await loadStats();
      }
    };
    
    initialLoad();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  return {
    stats,
    convocatoriaStats,
    myProgress,
    loading,
    error,
    reload: loadStats,
    loadConvocatoriaStats,
    loadMyProgress,
    loadPostulanteProgress,
    loadUsersActivity,
  };
};

