/**
 * Hook para gestionar especialidades
 */

import { useState, useRef } from 'react';
import { useToast } from '@shared/components/Toast';
import { requestGuard } from '@shared/utils/requestGuard';
import * as specialtyService from '../services/specialtyService';

export const useSpecialties = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true); // Iniciar en true para mostrar skeleton
  const [specialties, setSpecialties] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false); // Flag para evitar peticiones concurrentes

  /**
   * Listar especialidades
   */
  const loadSpecialties = async (params = {}) => {
    // Si ya hay una petición en curso, no hacer nada
    if (isLoadingRef.current) {
      return;
    }

    const requestKey = `specialties_${JSON.stringify(params)}`;
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await specialtyService.getSpecialties({
          ...params,
          page: params.page || pagination.page,
          page_size: params.page_size || pagination.page_size,
        });
        // Si la respuesta es un array directo, convertirla a formato paginado
        if (Array.isArray(response)) {
          setSpecialties(response);
          setPagination({
            page: 1,
            page_size: response.length,
            total: response.length,
          });
        } else {
          setSpecialties(response.results || []);
          setPagination({
            page: response.page || 1,
            page_size: response.page_size || 20,
            total: response.total || 0,
          });
        }
        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Error al cargar especialidades';
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
   * Obtener especialidad por ID
   */
  const getSpecialtyById = async (specialtyId) => {
    setLoading(true);
    setError(null);
    try {
      const specialty = await specialtyService.getSpecialtyById(specialtyId);
      return specialty;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al obtener especialidad';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear especialidad
   */
  const createSpecialty = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const newSpecialty = await specialtyService.createSpecialty(data);
      toast.success('Especialidad creada exitosamente');
      await loadSpecialties();
      return newSpecialty;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al crear especialidad';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar especialidad
   */
  const updateSpecialty = async (specialtyId, data, partial = true) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await specialtyService.updateSpecialty(specialtyId, data, partial);
      toast.success('Especialidad actualizada exitosamente');
      await loadSpecialties();
      return updated;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al actualizar especialidad';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar especialidad
   */
  const deleteSpecialty = async (specialtyId) => {
    setLoading(true);
    setError(null);
    try {
      await specialtyService.deleteSpecialty(specialtyId);
      toast.success('Especialidad eliminada exitosamente');
      await loadSpecialties();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al eliminar especialidad';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    specialties,
    pagination,
    error,
    loadSpecialties,
    getSpecialtyById,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  };
};

