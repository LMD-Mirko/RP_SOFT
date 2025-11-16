/**
 * Hook para gestionar tipos de documento
 */

import { useState, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as documentTypeService from '../services/documentTypeService';

export const useDocumentTypes = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true); // Iniciar en true para mostrar skeleton
  const [documentTypes, setDocumentTypes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  /**
   * Listar tipos de documento
   */
  const loadDocumentTypes = async (params = {}) => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    const requestKey = `document-types_${JSON.stringify(params)}`;
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await documentTypeService.getDocumentTypes({
          ...params,
          page: params.page || pagination.page,
          page_size: params.page_size || pagination.page_size,
        });
        // Si la respuesta es un array directo, convertirla a formato paginado
        if (Array.isArray(response)) {
          setDocumentTypes(response);
          setPagination({
            page: 1,
            page_size: response.length,
            total: response.length,
          });
        } else {
          setDocumentTypes(response.results || []);
          setPagination({
            page: response.page || 1,
            page_size: response.page_size || 20,
            total: response.total || 0,
          });
        }
        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Error al cargar tipos de documento';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    });
  };

  /**
   * Obtener tipo de documento por ID
   */
  const getDocumentTypeById = async (documentTypeId) => {
    setLoading(true);
    setError(null);
    try {
      const documentType = await documentTypeService.getDocumentTypeById(documentTypeId);
      return documentType;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al obtener tipo de documento';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear tipo de documento
   */
  const createDocumentType = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const newDocumentType = await documentTypeService.createDocumentType(data);
      toast.success('Tipo de documento creado exitosamente');
      await loadDocumentTypes();
      return newDocumentType;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al crear tipo de documento';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar tipo de documento
   */
  const updateDocumentType = async (documentTypeId, data, partial = true) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await documentTypeService.updateDocumentType(documentTypeId, data, partial);
      toast.success('Tipo de documento actualizado exitosamente');
      await loadDocumentTypes();
      return updated;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al actualizar tipo de documento';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar tipo de documento
   */
  const deleteDocumentType = async (documentTypeId) => {
    setLoading(true);
    setError(null);
    try {
      await documentTypeService.deleteDocumentType(documentTypeId);
      toast.success('Tipo de documento eliminado exitosamente');
      await loadDocumentTypes();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al eliminar tipo de documento';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    documentTypes,
    pagination,
    error,
    loadDocumentTypes,
    getDocumentTypeById,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
  };
};

