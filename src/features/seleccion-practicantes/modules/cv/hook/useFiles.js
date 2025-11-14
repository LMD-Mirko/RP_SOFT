import { useState, useEffect, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as fileService from '../services';

/**
 * Hook para gestionar archivos y documentos
 */
export const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const toast = useToast();
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  const loadFiles = async (page = 1) => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    const params = {
      page,
      page_size: pagination.page_size,
    };
    
    const requestKey = `my-documents_${JSON.stringify(params)}`;
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await fileService.getMyDocuments(params);
        setFiles(response.results || []);
        setPagination(prev => ({
          ...prev,
          page,
          total: response.total || 0,
        }));
        return response;
      } catch (err) {
        setError(err.message || 'Error al cargar documentos');
        toast.error(err.message || 'Error al cargar documentos');
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
      if (mounted && !isLoadingRef.current && files.length === 0) {
        await loadFiles(1);
      }
    };
    
    initialLoad();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  const uploadFile = async (file, documentType = null) => {
    try {
      const uploaded = await fileService.uploadFile(file, documentType);
      setFiles(prev => [uploaded, ...prev]);
      toast.success('Archivo subido exitosamente');
      return uploaded;
    } catch (err) {
      toast.error(err.message || 'Error al subir archivo');
      throw err;
    }
  };

  const deleteFile = async (documentId) => {
    try {
      await fileService.deleteDocument(documentId);
      setFiles(prev => prev.filter(f => f.id !== documentId));
      toast.success('Documento eliminado exitosamente');
    } catch (err) {
      toast.error(err.message || 'Error al eliminar documento');
      throw err;
    }
  };

  const downloadFile = async (documentId) => {
    try {
      const { download_url } = await fileService.getDownloadUrl(documentId);
      window.open(download_url, '_blank');
    } catch (err) {
      toast.error(err.message || 'Error al descargar documento');
      throw err;
    }
  };

  return {
    files,
    loading,
    error,
    pagination,
    loadFiles,
    uploadFile,
    deleteFile,
    downloadFile,
  };
};

