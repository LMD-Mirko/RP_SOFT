import { useState, useCallback } from 'react'
import { useToast } from '@shared/components/Toast'
import { requestGuard } from '@shared/utils/requestGuard'
import * as evaluacionService from '../services'

/**
 * Hook para gestionar el flujo completo de evaluación para postulantes
 */
export const useEvaluacionPostulante = () => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [evaluacion, setEvaluacion] = useState(null)
  const [intento, setIntento] = useState(null)
  const [respuestas, setRespuestas] = useState({})
  const [error, setError] = useState(null)

  /**
   * Inicia una evaluación desde una convocatoria
   */
  const iniciarEvaluacionConvocatoria = useCallback(async (jobPostingId) => {
    const requestKey = `start-evaluation-${jobPostingId}`
    
    return requestGuard(requestKey, async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await evaluacionService.iniciarEvaluacionConvocatoria(jobPostingId)
        setIntento(result)
        toast.success('Evaluación iniciada correctamente')
        return result
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar evaluación'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    })
  }, [toast])

  /**
   * Inicia un intento de evaluación
   */
  const iniciarIntento = useCallback(async (evaluationId) => {
    const requestKey = `start-attempt-${evaluationId}`
    
    return requestGuard(requestKey, async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await evaluacionService.iniciarIntento(evaluationId)
        setIntento(result)
        toast.success('Intento iniciado correctamente')
        return result
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar intento'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    })
  }, [toast])

  /**
   * Carga la evaluación para visualización
   */
  const cargarEvaluacion = useCallback(async (evaluationId) => {
    const requestKey = `load-evaluation-${evaluationId}`
    
    return requestGuard(requestKey, async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await evaluacionService.obtenerEvaluacionView(evaluationId)
        setEvaluacion(result)
        return result
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al cargar evaluación'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    })
  }, [toast])

  /**
   * Carga el intento activo
   */
  const cargarIntentoActivo = useCallback(async (evaluationId) => {
    const requestKey = `load-active-attempt-${evaluationId}`
    
    return requestGuard(requestKey, async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await evaluacionService.obtenerIntentoActivo(evaluationId)
        setIntento(result.attempt || result)
        
        // Cargar respuestas guardadas
        if (result.answers && Array.isArray(result.answers)) {
          const respuestasMap = {}
          result.answers.forEach((answer) => {
            respuestasMap[answer.question_id] = {
              answer_option_id: answer.answer_option_id,
              text_answer: answer.text_answer,
            }
          })
          setRespuestas(respuestasMap)
        }
        
        return result
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al cargar intento activo'
        setError(errorMessage)
        // No mostrar error si no hay intento activo (es normal)
        if (err.response?.status !== 404) {
          toast.error(errorMessage)
        }
        throw err
      } finally {
        setLoading(false)
      }
    })
  }, [toast])

  /**
   * Guarda una respuesta
   */
  const guardarRespuesta = useCallback(async (attemptId, questionId, answerOptionId, textAnswer = null) => {
    setLoading(true)
    setError(null)
    try {
      const data = {
        question_id: questionId,
        answer_option_id: answerOptionId,
        text_answer: textAnswer,
      }
      
      await evaluacionService.guardarRespuesta(attemptId, data)
      
      // Actualizar estado local
      setRespuestas((prev) => ({
        ...prev,
        [questionId]: {
          answer_option_id: answerOptionId,
          text_answer: textAnswer,
        },
      }))
      
      return true
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al guardar respuesta'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Guarda múltiples respuestas en lote
   */
  const guardarRespuestasBatch = useCallback(async (attemptId, answers) => {
    setLoading(true)
    setError(null)
    try {
      await evaluacionService.guardarRespuestasBatch(attemptId, { answers })
      
      // Actualizar estado local
      const respuestasMap = {}
      answers.forEach((answer) => {
        respuestasMap[answer.question_id] = {
          answer_option_id: answer.answer_option_id,
          text_answer: answer.text_answer,
        }
      })
      setRespuestas((prev) => ({ ...prev, ...respuestasMap }))
      
      toast.success('Respuestas guardadas correctamente')
      return true
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al guardar respuestas'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Califica el intento
   */
  const calificarIntento = useCallback(async (attemptId) => {
    setLoading(true)
    setError(null)
    try {
      const result = await evaluacionService.calificarIntento(attemptId)
      setIntento(result.attempt || result)
      toast.success('Evaluación calificada correctamente')
      return result
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al calificar evaluación'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Actualiza respuesta localmente (sin guardar en servidor)
   */
  const actualizarRespuestaLocal = useCallback((questionId, answerOptionId, textAnswer = null) => {
    setRespuestas((prev) => ({
      ...prev,
      [questionId]: {
        answer_option_id: answerOptionId,
        text_answer: textAnswer,
      },
    }))
  }, [])

  /**
   * Limpia el estado
   */
  const limpiarEstado = useCallback(() => {
    setEvaluacion(null)
    setIntento(null)
    setRespuestas({})
    setError(null)
  }, [])

  return {
    loading,
    evaluacion,
    intento,
    respuestas,
    error,
    iniciarEvaluacionConvocatoria,
    iniciarIntento,
    cargarEvaluacion,
    cargarIntentoActivo,
    guardarRespuesta,
    guardarRespuestasBatch,
    calificarIntento,
    actualizarRespuestaLocal,
    limpiarEstado,
  }
}

