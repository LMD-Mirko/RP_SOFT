import { useState, useEffect, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as dashboardService from '../services';

/**
 * Hook para obtener el dashboard del postulante
 */
export const usePostulantDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const isLoadingRef = useRef(false);

  const loadDashboard = async () => {
    if (isLoadingRef.current) {
      return;
    }

    return requestGuard('postulant_dashboard', async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getPostulantDashboard();
        setDashboardData(data);
        return data;
      } catch (err) {
        setError(err.message || 'Error al cargar dashboard');
        toast.error(err.message || 'Error al cargar dashboard');
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    
    const initialLoad = async () => {
      if (!mounted) return;
      await loadDashboard();
    };
    
    initialLoad();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dashboardData,
    loading,
    error,
    reload: loadDashboard,
  };
};

