import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as dashboardService from '../services';

/**
 * Hook para obtener estadísticas del dashboard
 */
export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [usersStats, setUsersStats] = useState(null);
  const [convocatoriaStats, setConvocatoriaStats] = useState(null);
  const [myProgress, setMyProgress] = useState(null);
  const [averageProgress, setAverageProgress] = useState({ 
    by_stage: [], 
    progress_distribution: {}, 
    by_specialty: [],
    by_convocatoria: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes
  const isLoadingUsersRef = useRef(false); // Flag para evitar peticiones concurrentes de usuarios
  const isLoadingAverageRef = useRef(false); // Flag para evitar peticiones concurrentes de progreso promedio

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

  const loadUsersStats = async () => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingUsersRef.current) {
      return;
    }

    return requestGuard('dashboard_users_stats', async () => {
      isLoadingUsersRef.current = true;
      try {
        const data = await dashboardService.getUsersStats();
        setUsersStats(data);
        return data;
      } catch (err) {
        console.error('Error al cargar estadísticas de usuarios:', err);
        // No mostrar error al usuario, solo retornar null
        setUsersStats(null);
        return null;
      } finally {
        isLoadingUsersRef.current = false;
      }
    });
  };

  const loadUsersActivity = useCallback(async (params = {}) => {
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
  }, []);

  const loadAverageProgress = async (jobPostingId = null) => {
    if (isLoadingAverageRef.current) {
      return;
    }

    return requestGuard('dashboard_average_progress', async () => {
      isLoadingAverageRef.current = true;
      try {
        const data = await dashboardService.getAverageProgress(jobPostingId);
        setAverageProgress(data);
        return data;
      } catch (err) {
        console.error('Error al cargar estadísticas de progreso promedio:', err);
        // No establecer null, dejar que se muestre el estado vacío
        setAverageProgress({ 
          by_stage: [], 
          progress_distribution: {}, 
          by_specialty: [],
          by_convocatoria: []
        });
        return null;
      } finally {
        isLoadingAverageRef.current = false;
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    
    const initialLoad = async () => {
      if (!mounted) return;
      
      // Cargar ambas APIs en paralelo
      const promises = [];
      
      if (!isLoadingRef.current && !stats) {
        promises.push(loadStats());
      }
      
      if (!isLoadingUsersRef.current && !usersStats) {
        promises.push(loadUsersStats());
      }
      
      if (!isLoadingAverageRef.current && (!averageProgress || (!averageProgress.by_stage?.length && !averageProgress.by_convocatoria?.length))) {
        promises.push(loadAverageProgress());
      }
      
      await Promise.all(promises);
    };
    
    initialLoad();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  return {
    stats,
    usersStats,
    convocatoriaStats,
    myProgress,
    averageProgress,
    loading,
    error,
    reload: loadStats,
    reloadUsersStats: loadUsersStats,
    loadConvocatoriaStats,
    loadMyProgress,
    loadPostulanteProgress,
    loadUsersActivity,
    loadAverageProgress,
  };
};

