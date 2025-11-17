import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@shared/components/Toast';
import * as postulacionService from '../services';
import * as fileService from '../../cv/services';
import * as evaluacionService from '../../gest.. evaluaciones/services';

/**
 * Hook para gestionar el flujo completo de postulación
 */
export const usePostulacion = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [convocatoriaId, setConvocatoriaId] = useState(null);
  const [postulacionId, setPostulacionId] = useState(null);
  const [personalData, setPersonalData] = useState(null);

  // Obtener convocatoriaId de la URL
  useEffect(() => {
    const id = searchParams.get('convocatoria');
    if (id) {
      setConvocatoriaId(parseInt(id));
    }
  }, [searchParams]);

  /**
   * Postularse a una convocatoria
   */
  const postularse = async (jobPostingId) => {
    setLoading(true);
    try {
      const result = await postulacionService.postularseConvocatoria(jobPostingId);
      setPostulacionId(result.id);
      setConvocatoriaId(jobPostingId);
      toast.success('Te has postulado exitosamente a la convocatoria');
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al postularse a la convocatoria');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar datos personales
   */
  const guardarDatosPersonales = async (data) => {
    setLoading(true);
    try {
      // Mapear datos del formulario al formato de la API
      const apiData = {
        document_type_id: parseInt(data.tipoDocumento),
        document_number: data.dni,
        birth_date: data.fechaNacimiento,
        sex: data.sexo || 'M', // Por defecto M si no se especifica
        phone: data.telefono.startsWith('+51') ? data.telefono : `+51${data.telefono}`,
        country_id: 184, // Perú
        region_id: parseInt(data.selectedData?.region?.id),
        province_id: parseInt(data.selectedData?.provincia?.id),
        district_id: parseInt(data.selectedData?.distrito?.id),
        address: data.direccion,
        specialty_id: parseInt(data.especialidadId),
        career: data.carrera || '',
        semester: String(data.semestre || ''),
        experience_level: data.nivelExperiencia || 'principiante',
      };

      const result = await postulacionService.guardarDatosPersonales(apiData);
      setPersonalData(result);
      toast.success('Datos personales guardados exitosamente');
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al guardar datos personales');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Subir CV
   */
  const subirCV = async (file) => {
    setLoading(true);
    try {
      const result = await fileService.uploadFile(file, 'CV');
      toast.success('CV subido exitosamente');
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al subir CV');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Iniciar evaluación
   */
  const iniciarEvaluacion = async (jobPostingId) => {
    setLoading(true);
    try {
      const result = await evaluacionService.startEvaluation(jobPostingId || convocatoriaId);
      toast.success('Evaluación iniciada exitosamente');
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al iniciar evaluación');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener datos personales guardados
   */
  const obtenerDatosPersonales = async () => {
    setLoading(true);
    try {
      const result = await postulacionService.obtenerDatosPersonales();
      setPersonalData(result);
      return result;
    } catch (error) {
      // Si no hay datos, no es un error crítico
      console.log('No hay datos personales guardados aún');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    convocatoriaId,
    postulacionId,
    personalData,
    postularse,
    guardarDatosPersonales,
    subirCV,
    iniciarEvaluacion,
    obtenerDatosPersonales,
  };
};

