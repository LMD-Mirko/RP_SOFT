import { useState, useEffect } from 'react'
import { Users, Calendar as CalendarIcon, Clock, User, Link } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { DatePicker } from '@shared/components/DatePicker'
import { Select } from '@shared/components/Select'
import styles from './ScheduleForm.module.css'

const durationOptions = [
  { value: '15', label: '15 minutos' },
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '60 minutos' },
  { value: '90', label: '90 minutos' },
]

const interviewerOptions = [
  { value: 'entrevistador1', label: 'Entrevistador 1' },
  { value: 'entrevistador2', label: 'Entrevistador 2' },
  { value: 'entrevistador3', label: 'Entrevistador 3' },
]

export function ScheduleForm({
  selectedDate,
  onSelectParticipants,
  participants = [],
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    motivo: '',
    fecha: selectedDate || new Date(),
    hora: '14:00',
    duracion: '30',
    entrevistador: '',
    enlace: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, fecha: date }))
  }

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, fecha: selectedDate }))
    }
  }, [selectedDate])

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
      <div className={styles.header}>
        <h2 className={styles.title}>Agendar reunión</h2>
        <p className={styles.subtitle}>Selecciona la información necesaria</p>
      </div>

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
          label="Motivo de la reunión"
          id="motivo"
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          placeholder="Ingrese el motivo"
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
              label="Duracion"
              id="duracion"
              name="duracion"
              value={formData.duracion}
              onChange={handleSelectChange}
              options={durationOptions}
              placeholder="Seleccionar duración"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Select
              label="Entrevistador"
              id="entrevistador"
              name="entrevistador"
              value={formData.entrevistador}
              onChange={handleSelectChange}
              options={interviewerOptions}
              placeholder="Seleccionar entrevistador"
              required
            />
          </div>
        </div>

        <Input
          label="Enlace de la reunion"
          id="enlace"
          name="enlace"
          type="url"
          value={formData.enlace}
          onChange={handleChange}
          placeholder="Link de la reunion"
          icon={Link}
          iconPosition="left"
        />

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            Crear
          </Button>
        </div>
      </form>
    </div>
  )
}

