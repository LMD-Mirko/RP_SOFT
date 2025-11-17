import { useState, useEffect, useMemo } from 'react'
import { Users, Calendar as CalendarIcon, Clock, User, Link } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { DatePicker } from '@shared/components/DatePicker'
import { Select } from '@shared/components/Select'
import { useUsers } from '../../../shared/hooks/useUsers'
import styles from './ScheduleForm.module.css'

const durationOptions = [
  { value: '15', label: '15 minutos' },
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '60 minutos' },
  { value: '90', label: '90 minutos' },
]

export function ScheduleForm({
  selectedDate,
  onSelectParticipants,
  participants = [],
  onSubmit,
  onCancel,
  initialData = null,
  isEditing = false,
  isLoading = false,
}) {
  const { users, loadUsers } = useUsers()
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      fecha: selectedDate || new Date(),
      hora: '14:00',
      duration: '30',
      interviewer: '',
      meeting_link: '',
      description: '',
    }
  )

  // Cargar usuarios (admins) para el selector de entrevistador
  useEffect(() => {
    loadUsers({ 
      is_active: true, 
      role_id: 2, // Solo admins
      page_size: 100 
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mapear usuarios a opciones para el select de entrevistador
  const interviewerOptions = useMemo(() => {
    return users.map((user) => {
      const fullName = `${user.name || ''} ${user.paternal_lastname || ''} ${user.maternal_lastname || ''}`.trim() || user.email || 'Sin nombre'
      return {
        value: user.id.toString(),
        label: `${fullName} (${user.email})`,
      }
    })
  }, [users])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, fecha: date }))
  }

  useEffect(() => {
    if (selectedDate && !initialData) {
      setFormData((prev) => ({ ...prev, fecha: selectedDate }))
    }
  }, [selectedDate, initialData])

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTimeChange = (e) => {
    setFormData((prev) => ({ ...prev, hora: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      participantes: participants,
    })
  }

  const formatSelectedDate = () => {
    if (!selectedDate) return ''
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const year = String(selectedDate.getFullYear()).slice(-2)
    return `${month}/${day}/${year}`
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Button
          type="button"
          variant="secondary"
          onClick={onSelectParticipants}
          fullWidth
          icon={Users}
          iconPosition="left"
          className={styles.participantsButton}
        >
          Seleccionar participantes
          {participants.length > 0 && (
            <span className={styles.participantsCount}>({participants.length})</span>
          )}
        </Button>

        <Input
          label="Título de la reunión"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Entrevista técnica, Reunión de seguimiento..."
          required
        />

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="fecha" className={styles.label}>
              Fecha
            </label>
            <DatePicker
              selected={formData.fecha}
              onChange={handleDateChange}
              placeholder={formatSelectedDate() || 'Seleccionar fecha'}
              withPortal={true}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="hora" className={styles.label}>
              Hora
            </label>
            <div className={styles.timeInputWrapper}>
              <Clock size={18} className={styles.timeIcon} />
              <input
                type="time"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleTimeChange}
                className={styles.timeInput}
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Select
              label="Duración"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleSelectChange}
              options={durationOptions}
              placeholder="Seleccionar duración"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Select
              label="Entrevistador"
              id="interviewer"
              name="interviewer"
              value={formData.interviewer}
              onChange={handleSelectChange}
              options={interviewerOptions}
              placeholder="Seleccionar entrevistador"
              required
              disabled={interviewerOptions.length === 0}
            />
          </div>
        </div>

        <Input
          label="Enlace de la reunión (opcional)"
          id="meeting_link"
          name="meeting_link"
          type="url"
          value={formData.meeting_link}
          onChange={handleChange}
          placeholder="https://meet.google.com/..."
          icon={Link}
          iconPosition="left"
        />

        <Input
          label="Descripción (opcional)"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción adicional de la reunión"
        />

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            fullWidth
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </div>
      </form>
    </div>
  )
}

