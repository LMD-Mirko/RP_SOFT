import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import * as evaluacionService from '../../services/evaluacionService'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../../shared/components/Skeleton'
import styles from './ConfiguracionEvaluacionPage.module.css'

export function ConfiguracionEvaluacionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [evaluacion, setEvaluacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time_limit_minutes: null,
    passing_score: null,
    max_attempts: 1,
    is_active: true,
    job_posting_id: null,
  })

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const evalData = await evaluacionService.getEvaluacionById(id)
        setEvaluacion(evalData)
        setFormData({
          title: evalData.title || '',
          description: evalData.description || '',
          time_limit_minutes: evalData.time_limit_minutes || null,
          passing_score: evalData.passing_score || null,
          max_attempts: evalData.max_attempts || 1,
          is_active: evalData.is_active !== undefined ? evalData.is_active : true,
          job_posting_id: evalData.job_posting_id || null,
        })
      } catch (error) {
        toast.error('Error al cargar la evaluación')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (value ? parseFloat(value) : null) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!id) return

    try {
      setSaving(true)
      const updatedEvaluacion = await evaluacionService.updateEvaluacion(id, formData)
      setEvaluacion(updatedEvaluacion)
      toast.success('Configuración guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar la configuración')
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate('/seleccion-practicantes/evaluaciones')}
            className={styles.backButton}
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
          <h1 className={styles.title}>
            Configuración: {evaluacion?.title || 'Evaluación'}
          </h1>
          <p className={styles.subtitle}>Configura los parámetros de la evaluación</p>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información Básica</h2>
            <Input
              label="Título"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título de la evaluación"
              required
            />
            <Input
              label="Descripción"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción de la evaluación"
              multiline
              rows={4}
            />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Parámetros de Evaluación</h2>
            <div className={styles.formRow}>
              <Input
                label="Tiempo Límite (minutos)"
                id="time_limit_minutes"
                name="time_limit_minutes"
                type="number"
                value={formData.time_limit_minutes || ''}
                onChange={handleChange}
                placeholder="Ej: 60"
                min="1"
              />
              <Input
                label="Puntaje Mínimo para Aprobar (%)"
                id="passing_score"
                name="passing_score"
                type="number"
                value={formData.passing_score || ''}
                onChange={handleChange}
                placeholder="Ej: 70"
                min="0"
                max="100"
              />
            </div>
            <Input
              label="Intentos Máximos"
              id="max_attempts"
              name="max_attempts"
              type="number"
              value={formData.max_attempts}
              onChange={handleChange}
              placeholder="Ej: 1"
              min="1"
            />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Estado</h2>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>Evaluación activa</span>
              </label>
              <p className={styles.helpText}>
                Si está desactivada, los postulantes no podrán acceder a esta evaluación.
              </p>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/seleccion-practicantes/evaluaciones')}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

