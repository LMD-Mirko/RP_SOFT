import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as cvsAdminService from '../services';

/**
 * Hook para gestionar CVs de administradores
 */
export const useCVsAdmin = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });
  const [filters, setFilters] = useState({
    postulant_id: null,
    job_posting_id: null,
  });
  
  const toast = useToast();
  const isLoadingRef = useRef(false);

  /**
   * Carga la lista de CVs
   */
  const loadCVs = useCallback(async (page = 1, pageSize = 20, customFilters = {}) => {
    if (isLoadingRef.current) return;

    return requestGuard('cvs_admin_list', async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const params = {
          page,
          page_size: pageSize,
          ...filters,
          ...customFilters,
        };

        const data = await cvsAdminService.listAllCVs(params);
        
        setCvs(data.results || []);
        setPagination(data.pagination || {
          page: 1,
          page_size: pageSize,
          total: 0,
          total_pages: 0,
          has_next: false,
          has_previous: false,
        });
        
        return data;
      } catch (err) {
        const errorMessage = err.message || 'Error al cargar CVs';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  }, [filters, toast]);

  /**
   * Descarga un CV
   */
  const downloadCV = useCallback(async (documentId, filename) => {
    try {
      // El backend actúa como proxy y devuelve el archivo directamente
      const blob = await cvsAdminService.downloadCV(documentId, true);
      
      // Crear URL temporal y descargar con el nombre original del archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'cv.pdf';
      document.body.appendChild(link);
      
      // Ejecutar el click para iniciar la descarga
      link.click();
      
      // Limpiar inmediatamente el elemento del DOM
      document.body.removeChild(link);
      
      // Usar requestAnimationFrame para asegurar que el click se procesó
      // y luego mostrar el toast después de un pequeño delay
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          toast.success('CV descargado exitosamente');
        }, 300);
      });
    } catch (err) {
      const errorMessage = err.message || 'Error al descargar CV';
      toast.error(errorMessage);
      throw err;
    }
  }, [toast]);

  /**
   * Obtiene la URL de previsualización
   */
  const getPreviewUrl = useCallback((documentId) => {
    return cvsAdminService.getPreviewUrl(documentId);
  }, []);

  /**
   * Actualiza los filtros y recarga los CVs
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Cambia de página
   */
  const changePage = useCallback((newPage) => {
    loadCVs(newPage, pagination.page_size);
  }, [loadCVs, pagination.page_size]);

  // Cargar CVs al montar o cuando cambien los filtros
  useEffect(() => {
    loadCVs(1, pagination.page_size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.postulant_id, filters.job_posting_id]); // Solo recargar cuando cambien los filtros

  return {
    cvs,
    loading,
    error,
    pagination,
    filters,
    loadCVs,
    downloadCV,
    getPreviewUrl,
    updateFilters,
    changePage,
  };
};

