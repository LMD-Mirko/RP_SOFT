import { useState, useRef, useCallback } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as historialService from '../services';

/**
 * Hook para gestionar historial de practicantes
 */
export const useHistorialPracticantes = (filters = {}) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pagina: 1,
    por_pagina: 10,
    total: 0,
    total_paginas: 0,
  });
  const toast = useToast();
  const isLoadingRef = useRef(false);

  const loadHistorial = useCallback(async (pagina = 1, params = {}) => {
    if (isLoadingRef.current) {
      return;
    }

    const requestParams = {
      pagina,
      por_pagina: params.por_pagina || pagination.por_pagina,
      ...filters,
      ...params,
    };

    // Mapear filtros del frontend a los del backend
    if (params.buscar) requestParams.busqueda = params.buscar;
    if (params.area) requestParams.area = params.area;
    if (params.tipoAccion) {
      // Mapear tipos de acción del frontend a los del backend
      const tipoAccionMap = {
        'Advertencia': 'advertencia',
        'Traslado': 'traslado',
        'Expulsión': 'expulsion',
      };
      requestParams.tipo_accion = tipoAccionMap[params.tipoAccion] || params.tipoAccion.toLowerCase();
    }
    if (params.estado) {
      // Mapear estados del frontend a los del backend
      const estadoMap = {
        'Activo': 'activo',
        'Transferido': 'trasladado',
        'Expulsado': 'expulsado',
      };
      requestParams.estado = estadoMap[params.estado] || params.estado.toLowerCase();
    }
    if (params.fecha_desde) requestParams.fecha_desde = params.fecha_desde;
    if (params.fecha_hasta) requestParams.fecha_hasta = params.fecha_hasta;

    const requestKey = `historial_practicantes_${JSON.stringify(requestParams)}`;

    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await historialService.getHistorialAcciones(requestParams);
        const historialData = (response && response.data) 
          ? response.data 
          : [];
        setHistorial(Array.isArray(historialData) ? historialData : []);
        setPagination(prev => ({
          ...prev,
          pagina: response.paginacion?.pagina || pagina,
          por_pagina: response.paginacion?.por_pagina || requestParams.por_pagina,
          total: response.paginacion?.total || historialData.length,
          total_paginas: response.paginacion?.total_paginas || Math.ceil((response.paginacion?.total || historialData.length) / (requestParams.por_pagina || 10)),
        }));
        return response;
      } catch (err) {
        setError(err.message || 'Error al cargar historial');
        toast.error(err.message || 'Error al cargar historial');
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  }, [filters, pagination.por_pagina, toast]);

  const registrarAccion = async (data) => {
    try {
      setLoading(true);
      const response = await historialService.registrarAccion(data);
      await loadHistorial(pagination.pagina);
      const message = response?.message || 'Acción registrada exitosamente';
      toast.success(message, 4000, '¡Acción registrada!');
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar acción';
      toast.error(errorMessage, 4000, 'Error al registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    historial,
    loading,
    error,
    pagination,
    loadHistorial,
    registrarAccion,
  };
};

