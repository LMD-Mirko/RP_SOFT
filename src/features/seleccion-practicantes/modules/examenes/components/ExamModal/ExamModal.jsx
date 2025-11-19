import { BookOpen, Clock, Award, CheckCircle, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { DatePicker } from '@shared/components/DatePicker'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import { Button } from '@shared/components/Button'
import styles from './ExamModal.module.css'

export function ExamModal({ isOpen, onClose, onSave, exam = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: null,
    end_date: null,
    time_limit_minutes: '',
    passing_score: '',
    max_attempts: '',
    is_active: true,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || '',
        description: exam.description || '',
        start_date: exam.start_date ? new Date(exam.start_date) : null,
        end_date: exam.end_date ? new Date(exam.end_date) : null,
        time_limit_minutes: exam.time_limit_minutes || '',
        passing_score: exam.passing_score || '',
        max_attempts: exam.max_attempts || '',
        is_active: exam.is_active !== undefined ? exam.is_active : true,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        start_date: null,
        end_date: null,
        time_limit_minutes: '',
        passing_score: '',
        max_attempts: '',
        is_active: true,
      })
    }
    setErrors({})
  }, [exam, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (!formData.start_date) {
      newErrors.start_date = 'La fecha de inicio es requerida'
    }

    if (!formData.end_date) {
      newErrors.end_date = 'La fecha de fin es requerida'
    }

    if (formData.start_date && formData.end_date) {
      if (formData.end_date < formData.start_date) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
    }

    if (formData.time_limit_minutes && parseFloat(formData.time_limit_minutes) < 1) {
      newErrors.time_limit_minutes = 'El tiempo límite debe ser mayor a 0'
    }

    if (formData.passing_score && (parseFloat(formData.passing_score) < 0 || parseFloat(formData.passing_score) > 20)) {
      newErrors.passing_score = 'La nota mínima debe estar entre 0 y 20'
    }

    if (formData.max_attempts && parseInt(formData.max_attempts) < 1) {
      newErrors.max_attempts = 'Los intentos máximos deben ser mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Preparar datos para la API
    const apiData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      start_date: formData.start_date ? formData.start_date.toISOString() : null,
      end_date: formData.end_date ? formData.end_date.toISOString() : null,
      time_limit_minutes: formData.time_limit_minutes ? parseFloat(formData.time_limit_minutes) : null,
      passing_score: formData.passing_score ? parseFloat(formData.passing_score) : null,
      max_attempts: formData.max_attempts ? parseInt(formData.max_attempts) : null,
      is_active: formData.is_active,
    }

    onSave(apiData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exam ? 'Editar Examen' : 'Nuevo Examen'}
      size="md"
      closeOnOverlayClick={!isLoading}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Título"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Examen de React Avanzado"
          icon={BookOpen}
          iconPosition="left"
          required
          error={!!errors.title}
          helperText={errors.title}
          disabled={isLoading}
        />

        <Textarea
          label="Descripción"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe el examen..."
          rows={3}
          required
          error={!!errors.description}
          helperText={errors.description}
          disabled={isLoading}
        />

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="start_date" className={styles.label}>
              Fecha Inicio *
            </label>
            <DatePicker
              selected={formData.start_date}
              onChange={(date) => handleDateChange('start_date', date)}
              placeholder="Seleccionar fecha de inicio"
              minDate={new Date()}
              maxDate={formData.end_date}
            />
            {errors.start_date && (
              <span className={styles.errorText}>{errors.start_date}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="end_date" className={styles.label}>
              Fecha Fin *
            </label>
            <DatePicker
              selected={formData.end_date}
              onChange={(date) => handleDateChange('end_date', date)}
              placeholder="Seleccionar fecha de fin"
              minDate={formData.start_date || new Date()}
            />
            {errors.end_date && (
              <span className={styles.errorText}>{errors.end_date}</span>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <Input
            label="Tiempo Límite (minutos)"
            type="number"
            id="time_limit_minutes"
            name="time_limit_minutes"
            value={formData.time_limit_minutes}
            onChange={handleChange}
            placeholder="Ej: 90"
            icon={Clock}
            iconPosition="left"
            min="1"
            error={!!errors.time_limit_minutes}
            helperText={errors.time_limit_minutes || 'Opcional: tiempo máximo para completar el examen'}
            disabled={isLoading}
          />

          <Input
            label="Nota Mínima (0-20)"
            type="number"
            id="passing_score"
            name="passing_score"
            value={formData.passing_score}
            onChange={handleChange}
            placeholder="Ej: 14.0"
            icon={Award}
            iconPosition="left"
            min="0"
            max="20"
            step="0.5"
            error={!!errors.passing_score}
            helperText={errors.passing_score || 'Opcional: nota mínima para aprobar'}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formRow}>
          <Input
            label="Intentos Máximos"
            type="number"
            id="max_attempts"
            name="max_attempts"
            value={formData.max_attempts}
            onChange={handleChange}
            placeholder="Ej: 3"
            icon={CheckCircle}
            iconPosition="left"
            min="1"
            error={!!errors.max_attempts}
            helperText={errors.max_attempts || 'Opcional: número máximo de intentos permitidos'}
            disabled={isLoading}
          />

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className={styles.checkbox}
                disabled={isLoading}
              />
              <span className={styles.checkboxText}>Examen activo</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            fullWidth
          >
            {exam ? 'Guardar Cambios' : 'Crear Examen'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

