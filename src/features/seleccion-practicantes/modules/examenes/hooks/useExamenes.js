import { useState, useEffect, useRef } from 'react'
import { useToast } from '@shared/components/Toast'
import { requestGuard } from '@shared/utils/requestGuard'
import * as examService from '../services'

/**
 * Hook para gestionar exámenes
 */
export const useExamenes = (filters = {}) => {
  const [examenes, setExamenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  })
  const toast = useToast()
  const isLoadingRef = useRef(false)

  const loadExamenes = async (page = 1) => {
    if (isLoadingRef.current) {
      return
    }

    const params = {
      page,
      page_size: pagination.page_size,
      ...filters,
    }
    
    const requestKey = `examenes_${JSON.stringify(params)}`
    
    return requestGuard(requestKey, async () => {
      isLoadingRef.current = true
      setLoading(true)
      setError(null)
      try {
        const response = await examService.getExams(params)
        setExamenes(response.results || [])
        setPagination(prev => ({
          ...prev,
          page,
          total: response.total || 0,
        }))
        return response
      } catch (err) {
        setError(err.message || 'Error al cargar exámenes')
        toast.error(err.message || 'Error al cargar exámenes')
        throw err
      } finally {
        setLoading(false)
        isLoadingRef.current = false
      }
    })
  }

  useEffect(() => {
    loadExamenes(1)
  }, [])

  const createExam = async (data) => {
    try {
      const response = await examService.createExam(data)
      toast.success('Examen creado exitosamente')
      await loadExamenes(1)
      return response
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Error al crear examen'
      toast.error(errorMessage)
      throw err
    }
  }

  const createExamFromJson = async (data) => {
    try {
      const response = await examService.createExamFromJson(data)
      toast.success('Examen creado exitosamente')
      await loadExamenes(1)
      return response
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Error al crear examen'
      toast.error(errorMessage)
      throw err
    }
  }

  const updateExam = async (examId, data) => {
    try {
      const response = await examService.updateExam(examId, data)
      toast.success('Examen actualizado exitosamente')
      await loadExamenes(pagination.page)
      return response
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Error al actualizar examen'
      toast.error(errorMessage)
      throw err
    }
  }

  const deleteExam = async (examId) => {
    try {
      await examService.deleteExam(examId)
      toast.success('Examen eliminado exitosamente')
      await loadExamenes(pagination.page)
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Error al eliminar examen'
      toast.error(errorMessage)
      throw err
    }
  }

  return {
    examenes,
    loading,
    error,
    pagination,
    loadExamenes,
    createExam,
    createExamFromJson,
    updateExam,
    deleteExam: deleteExam,
  }
}

