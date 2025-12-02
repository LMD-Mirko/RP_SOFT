import { useState, useCallback } from 'react'
import { useToast } from '@shared/components/Toast'
import { requestGuard } from '@shared/utils/requestGuard'
import * as evaluacionService from '../services'

/**
 * Hook para gestionar la lista de intentos del postulante
 */
export const useMisEvaluaciones = () => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [intentos, setIntentos] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0,
  })
  const [error, setError] = useState(null)

  /**
   * Carga los intentos del postulante
   */
  const cargarIntentos = useCallback(async (params = {}) => {
    const requestKey = 'my-evaluation-attempts'
    
    return requestGuard(requestKey, async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await evaluacionService.obtenerMisIntentos(params)
        
        const intentosList = result.results || result || []
        setIntentos(intentosList)
        
        // Actualizar paginación
        if (result.page !== undefined) {
          setPagination({
            page: result.page || 1,
            page_size: result.page_size || 20,
            total: result.total || intentosList.length,
            total_pages: result.total_pages || Math.ceil((result.total || intentosList.length) / (result.page_size || 20)),
          })
        }
        
        return result
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al cargar intentos'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    })
  }, [toast])

  /**
   * Obtiene un intento específico por ID
   */
  const obtenerIntentoPorId = useCallback(async (attemptId) => {
    setLoading(true)
    setError(null)
    try {
      const result = await evaluacionService.obtenerIntentoPorId(attemptId)
      return result
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener intento'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  return {
    loading,
    intentos,
    pagination,
    error,
    cargarIntentos,
    obtenerIntentoPorId,
  }
}

