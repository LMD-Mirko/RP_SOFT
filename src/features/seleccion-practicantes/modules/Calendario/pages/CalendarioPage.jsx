import { useState } from 'react'
import { CalendarView } from '../components/CalendarView'
import { ScheduleForm } from '../components/ScheduleForm'
import { ParticipantsModal } from '../components/ParticipantsModal'
import { useToast } from '@shared/components/Toast'
import styles from './CalendarioPage.module.css'

// Datos mock de reuniones programadas
const mockScheduledDates = {
  '2025-01-01': { type: 'green' },
  '2025-01-02': { type: 'yellow' },
  '2025-01-18': { type: 'green' },
  '2025-01-20': { type: 'green' },
}

export function CalendarioPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [scheduledDates, setScheduledDates] = useState(mockScheduledDates)
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const toast = useToast()

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleSelectParticipants = () => {
    setIsParticipantsModalOpen(true)
  }

  const handleParticipantsConfirm = (participants) => {
    setSelectedParticipants(participants)
    toast.success(`${participants.length} participante(s) seleccionado(s)`)
  }

  const handleFormSubmit = (formData) => {
    // Crear la reunión
    const dateKey = `${formData.fecha.getFullYear()}-${String(formData.fecha.getMonth() + 1).padStart(2, '0')}-${String(formData.fecha.getDate()).padStart(2, '0')}`
    
    setScheduledDates((prev) => ({
      ...prev,
      [dateKey]: { type: 'green' },
    }))

    toast.success('Reunión agendada correctamente')
    
    // Resetear formulario
    setSelectedParticipants([])
  }

  const handleFormCancel = () => {
    setSelectedParticipants([])
    setSelectedDate(new Date())
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calendario de Entrevistas</h1>
          <p className={styles.subtitle}>
            Agenda visual para programar y gestionar entrevistas generales
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Calendario (Izquierda) */}
        <div className={styles.calendarSection}>
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            scheduledDates={scheduledDates}
          />
        </div>

        {/* Formulario (Derecha) */}
        <div className={styles.formSection}>
          <ScheduleForm
            selectedDate={selectedDate}
            onSelectParticipants={handleSelectParticipants}
            participants={selectedParticipants}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      </div>

      {/* Modal de Participantes */}
      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        selectedParticipants={selectedParticipants.map((p) => p.id)}
        onConfirm={handleParticipantsConfirm}
      />
    </div>
  )
}

