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
      // Separar nombres y apellidos
      // name: todos los nombres (ej: "Juan Carlos")
      // paternal_lastname: primer apellido (ej: "Pérez")
      // maternal_lastname: resto de apellidos (ej: "García")
      const nombres = (data.nombres || '').trim();
      const apellidos = (data.apellidos || '').trim();
      const apellidosArray = apellidos.split(' ').filter(a => a.length > 0);
      
      const name = nombres || '';
      const paternal_lastname = apellidosArray[0] || '';
      const maternal_lastname = apellidosArray.slice(1).join(' ') || '';

      // Mapear nivel de experiencia al formato del API
      const experienceLevelMap = {
        'principiante': 'beginner',
        'intermedio': 'intermediate',
        'avanzado': 'advanced',
        'beginner': 'beginner',
        'intermediate': 'intermediate',
        'advanced': 'advanced'
      };

      // Mapear datos del formulario al formato de la API según FRONTEND_POST_PERSONAL_DATA.md
      // NOTA: Los campos del User (name, paternal_lastname, etc.) vienen del GET y siempre se envían
      // Los campos específicos del postulante son los que el usuario completa
      const apiData = {
        // Campos del User (siempre se envían, vienen del GET/personalData)
        name: name || personalData?.name || '',
        paternal_lastname: paternal_lastname || personalData?.paternal_lastname || '',
        document_number: (data.dni || personalData?.document_number || '').trim(),
        
        // Apellido materno (puede venir del User o estar vacío)
        ...(maternal_lastname ? { maternal_lastname: maternal_lastname } : 
            personalData?.maternal_lastname ? { maternal_lastname: personalData.maternal_lastname } : {}),
        
        // Teléfono (viene del User, siempre se envía)
        ...(personalData?.phone ? { phone: personalData.phone } : 
            data.telefono && data.telefono.trim() ? { 
              phone: data.telefono.startsWith('+51') ? data.telefono.trim() : `+51${data.telefono.trim()}` 
            } : {}),
        
        // District ID (viene del User)
        district_id: data.selectedData?.distrito?.id 
          ? parseInt(data.selectedData.distrito.id) 
          : (personalData?.district_id || null),
        
        // Campos específicos del postulante (estos son los que el usuario completa)
        ...(data.fechaNacimiento && data.fechaNacimiento.trim() && { birth_date: data.fechaNacimiento }),
        ...(data.direccion && data.direccion.trim() && { address: data.direccion.trim() }),
        ...(data.especialidadId && { specialty_id: parseInt(data.especialidadId) }),
        ...(data.carrera && data.carrera.trim() && { career: data.carrera.trim() }),
        ...(data.semestre && data.semestre.toString().trim() && { semester: String(data.semestre).trim() }),
        ...(data.nivelExperiencia && { 
          experience_level: experienceLevelMap[data.nivelExperiencia] || 'beginner' 
        }),
      };

      const result = await postulacionService.guardarDatosPersonales(apiData);
      setPersonalData(result);
      toast.success('Datos personales guardados exitosamente');
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Error al guardar datos personales';
      toast.error(errorMessage);
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
   * NOTA: El GET siempre retorna 200 OK, incluso si no hay datos completos
   * Los datos básicos vienen del User (siempre existen)
   * Los datos específicos del postulante pueden ser null
   */
  const obtenerDatosPersonales = async () => {
    setLoading(true);
    try {
      const result = await postulacionService.obtenerDatosPersonales();
      setPersonalData(result);
      return result;
    } catch (error) {
      // Esto no debería pasar, pero por si acaso
      console.error('Error al obtener datos personales:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar encuesta de perfil
   */
  const guardarEncuestaPerfil = async (surveyData) => {
    setLoading(true);
    try {
      const result = await postulacionService.guardarEncuestaPerfil(surveyData);
      toast.success('Encuesta de perfil guardada exitosamente');
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al guardar encuesta de perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar encuesta psicológica
   */
  const guardarEncuestaPsicologica = async (surveyData) => {
    setLoading(true);
    try {
      const result = await postulacionService.guardarEncuestaPsicologica(surveyData);
      toast.success('Encuesta psicológica guardada exitosamente');
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al guardar encuesta psicológica');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar encuesta de motivación
   */
  const guardarEncuestaMotivacion = async (surveyData) => {
    setLoading(true);
    try {
      const result = await postulacionService.guardarEncuestaMotivacion(surveyData);
      toast.success('Encuesta de motivación guardada exitosamente');
      return result;
    } catch (error) {
      toast.error(error.message || 'Error al guardar encuesta de motivación');
      throw error;
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
    guardarEncuestaPerfil,
    guardarEncuestaPsicologica,
    guardarEncuestaMotivacion,
  };
};

