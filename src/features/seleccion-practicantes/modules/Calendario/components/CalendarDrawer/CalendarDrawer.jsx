import { X, Calendar as CalendarIcon, Clock, User, Users } from 'lucide-react'
import { CalendarView } from '../CalendarView'
import { useMemo } from 'react'
import styles from './CalendarDrawer.module.css'
import clsx from 'clsx'

const formatTime = (timeString) => {
  if (!timeString) return '-'
  const time = timeString.substring(0, 5)
  return time
}

export function CalendarDrawer({ isOpen, onClose, selectedDate, onDateSelect, scheduledDates, meetings = [] }) {
  // Obtener reuniones del día seleccionado
  const dayMeetings = useMemo(() => {
    if (!selectedDate) return []
    
    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    return meetings.filter((meeting) => meeting.date === dateKey)
  }, [selectedDate, meetings])

  const formatSelectedDate = () => {
    if (!selectedDate) return 'Selecciona una fecha'
    return selectedDate.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={clsx(styles.drawer, isOpen && styles.drawerOpen)}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <CalendarIcon size={20} />
            <span>Calendario</span>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.drawerContent}>
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              onDateSelect(date)
            }}
            scheduledDates={scheduledDates}
          />

          {/* Lista de Reuniones del Día Seleccionado */}
          {selectedDate && (
            <div className={styles.meetingsSection}>
              <div className={styles.meetingsHeader}>
                <h3 className={styles.meetingsTitle}>Reuniones del día</h3>
                <p className={styles.meetingsDate}>{formatSelectedDate()}</p>
              </div>
              
              <div className={styles.meetingsList}>
                {dayMeetings.length > 0 ? (
                  dayMeetings.map((meeting) => (
                    <div key={meeting.id} className={styles.meetingCard}>
                      <div className={styles.meetingCardHeader}>
                        <div className={styles.meetingTime}>
                          <Clock size={14} />
                          <span>{formatTime(meeting.time)}</span>
                        </div>
                        <span className={styles.meetingDuration}>{meeting.duration} min</span>
                      </div>
                      <h4 className={styles.meetingCardTitle}>{meeting.title}</h4>
                      {meeting.interviewer_name && (
                        <div className={styles.meetingCardInfo}>
                          <User size={12} />
                          <span>{meeting.interviewer_name}</span>
                        </div>
                      )}
                      {meeting.participants && meeting.participants.length > 0 && (
                        <div className={styles.meetingCardInfo}>
                          <Users size={12} />
                          <span>{meeting.participants.length} participante(s)</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={styles.noMeetings}>
                    <p>No hay reuniones programadas para este día</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

