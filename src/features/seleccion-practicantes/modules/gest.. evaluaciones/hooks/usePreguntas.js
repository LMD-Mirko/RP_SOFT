import { useState } from 'react'
import { useToast } from '@shared/components/Toast'
import * as preguntasService from '../services/preguntasService'

export const usePreguntas = (evaluationId) => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [preguntas, setPreguntas] = useState([])

  const loadPreguntas = async () => {
    if (!evaluationId) return

    setLoading(true)
    try {
      const response = await preguntasService.getPreguntas(evaluationId, {
        include_answer_options: true,
      })
      const preguntasList = response.results || response || []
      // Ordenar por order si existe
      const sorted = [...preguntasList].sort((a, b) => (a.order || 0) - (b.order || 0))
      setPreguntas(sorted)
      return sorted
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al cargar preguntas'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createPregunta = async (data) => {
    if (!evaluationId) return

    setLoading(true)
    try {
      const result = await preguntasService.createPregunta(evaluationId, data)
      toast.success('Pregunta creada correctamente')
      await loadPreguntas()
      return result
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al crear pregunta'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updatePregunta = async (questionId, data) => {
    if (!evaluationId) return

    setLoading(true)
    try {
      const result = await preguntasService.updatePregunta(evaluationId, questionId, data)
      toast.success('Pregunta actualizada correctamente')
      await loadPreguntas()
      return result
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al actualizar pregunta'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deletePregunta = async (questionId) => {
    if (!evaluationId) return

    setLoading(true)
    try {
      await preguntasService.deletePregunta(evaluationId, questionId)
      toast.success('Pregunta eliminada correctamente')
      await loadPreguntas()
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al eliminar pregunta'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createOpcionRespuesta = async (questionId, data) => {
    if (!evaluationId) return

    setLoading(true)
    try {
      const result = await preguntasService.createOpcionRespuesta(evaluationId, questionId, data)
      toast.success('Opción de respuesta creada correctamente')
      await loadPreguntas()
      return result
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al crear opción de respuesta'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateOpcionRespuesta = async (questionId, optionId, data) => {
    if (!evaluationId) return

    setLoading(true)
    try {
      const result = await preguntasService.updateOpcionRespuesta(
        evaluationId,
        questionId,
        optionId,
        data
      )
      toast.success('Opción de respuesta actualizada correctamente')
      await loadPreguntas()
      return result
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al actualizar opción de respuesta'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteOpcionRespuesta = async (questionId, optionId) => {
    if (!evaluationId) return

    setLoading(true)
    try {
      await preguntasService.deleteOpcionRespuesta(evaluationId, questionId, optionId)
      toast.success('Opción de respuesta eliminada correctamente')
      await loadPreguntas()
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al eliminar opción de respuesta'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const reorderPreguntas = async (questionOrders) => {
    if (!evaluationId) return

    setLoading(true)
    try {
      await preguntasService.reorderPreguntas(evaluationId, questionOrders)
      toast.success('Preguntas reordenadas correctamente')
      await loadPreguntas()
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error al reordenar preguntas'
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    preguntas,
    loadPreguntas,
    createPregunta,
    updatePregunta,
    deletePregunta,
    createOpcionRespuesta,
    updateOpcionRespuesta,
    deleteOpcionRespuesta,
    reorderPreguntas,
  }
}

