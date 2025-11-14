import { useState, useEffect, useCallback } from 'react'
import {
  loadConfiguracion,
  saveConfiguracion,
  saveConfiguracionSection,
  getConfiguracionSection,
} from '../services/configuracionService'

/**
 * Hook personalizado para gestionar las configuraciones
 * Proporciona estado y funciones para cargar/guardar configuraciones
 */
export function useConfiguracion() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar configuración al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const loadedConfig = await loadConfiguracion()
        setConfig(loadedConfig)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error al cargar configuración:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  /**
   * Actualiza una sección específica de la configuración
   */
  const updateSection = useCallback(async (section, data) => {
    try {
      await saveConfiguracionSection(section, data)
      setConfig((prev) => {
        const updated = {
          ...prev,
          [section]: data,
        }
        return updated
      })
      return true
    } catch (err) {
      setError(err.message)
      console.error(`Error al actualizar sección ${section}:`, err)
      throw err
    }
  }, [])

  /**
   * Actualiza toda la configuración
   */
  const updateConfig = useCallback(async (newConfig) => {
    try {
      await saveConfiguracion(newConfig)
      setConfig((prev) => {
        const updated = { ...prev, ...newConfig }
        return updated
      })
      return true
    } catch (err) {
      setError(err.message)
      console.error('Error al actualizar configuración:', err)
      throw err
    }
  }, [])

  /**
   * Obtiene una sección específica
   */
  const getSection = useCallback(
    (section) => {
      return config?.[section] || null
    },
    [config]
  )

  /**
   * Actualiza un campo específico dentro de una sección
   */
  const updateField = useCallback(
    async (section, field, value) => {
      try {
        const sectionData = config?.[section] || {}
        const updatedSection = {
          ...sectionData,
          [field]: value,
        }
        await saveConfiguracionSection(section, updatedSection)
        setConfig((prev) => {
          const updated = {
            ...prev,
            [section]: updatedSection,
          }
          return updated
        })
        return true
      } catch (err) {
        setError(err.message)
        console.error(`Error al actualizar campo ${field} en ${section}:`, err)
        throw err
      }
    },
    [config]
  )

  /**
   * Actualiza un campo anidado dentro de una sección
   */
  const updateNestedField = useCallback(
    async (section, path, value) => {
      try {
        const sectionData = config?.[section] || {}
        const keys = path.split('.')
        const updatedSection = { ...sectionData }

        let current = updatedSection
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] }
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value

        await saveConfiguracionSection(section, updatedSection)
        setConfig((prev) => {
          const updated = {
            ...prev,
            [section]: updatedSection,
          }
          return updated
        })
        return true
      } catch (err) {
        setError(err.message)
        console.error(`Error al actualizar campo anidado ${path} en ${section}:`, err)
        throw err
      }
    },
    [config]
  )

  return {
    config,
    loading,
    error,
    updateSection,
    updateConfig,
    getSection,
    updateField,
    updateNestedField,
  }
}


