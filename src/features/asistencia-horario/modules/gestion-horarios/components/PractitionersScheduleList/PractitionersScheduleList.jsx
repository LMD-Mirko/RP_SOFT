import { useState } from 'react'
import { Users, Search, Edit, Trash2, Calendar } from 'lucide-react'
import styles from './PractitionersScheduleList.module.css'

const practitioners = [
  {
    id: 1,
    name: 'Juan Pérez',
    server: 'Rpsoft',
    schedules: [{ day: 'Lunes', time: '10:00-12:00', type: 'partial' }]
  },
  {
    id: 2,
    name: 'María García',
    server: 'Innovacion',
    schedules: [{ day: 'Martes', time: '08:00-14:00', type: 'full' }]
  },
  {
    id: 3,
    name: 'Carlos López',
    server: 'Laboratorios',
    schedules: [{ day: 'Miércoles', time: '11:00-13:00', type: 'partial' }]
  },
  {
    id: 4,
    name: 'Ana Martínez',
    server: 'MiniBootcamp',
    schedules: [{ day: 'Jueves', time: '09:00-11:00', type: 'partial' }]
  },
  {
    id: 5,
    name: 'Luis Rodríguez',
    server: 'Recuperacion',
    schedules: [{ day: 'Viernes', time: '08:00-14:00', type: 'full' }]
  }
]

export function PractitionersScheduleList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPractitioner, setEditingPractitioner] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [practitionersData, setPractitionersData] = useState(practitioners)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [practitionerToDelete, setPractitionerToDelete] = useState(null)

  const filteredPractitioners = practitionersData.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [enabledDays, setEnabledDays] = useState({})
  const [scheduleData, setScheduleData] = useState({})
  const [selectedServer, setSelectedServer] = useState('')

  const handleEdit = (practitioner) => {
    setEditingPractitioner(practitioner)
    setShowEditModal(true)
    setSelectedServer(practitioner.server)
    
    // Inicializar estado de días habilitados y datos de horario
    const daysState = {}
    const scheduleState = {}
    
    ;['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].forEach((day) => {
      const schedule = practitioner.schedules.find((s) => s.day === day)
      daysState[day] = !!schedule
      scheduleState[day] = schedule || { day, time: '08:00-14:00', type: 'partial' }
    })
    
    setEnabledDays(daysState)
    setScheduleData(scheduleState)
  }

  const handleCloseModal = () => {
    setShowEditModal(false)
    setEditingPractitioner(null)
    setEnabledDays({})
    setScheduleData({})
    setSelectedServer('')
  }

  const handleDayToggle = (day) => {
    setEnabledDays((prev) => ({
      ...prev,
      [day]: !prev[day]
    }))
  }

  const handleTimeChange = (day, field, value) => {
    setScheduleData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    const updatedSchedules = Object.keys(enabledDays)
      .filter((day) => enabledDays[day])
      .map((day) => scheduleData[day])
    
    // Actualizar el practicante en el estado
    setPractitionersData((prev) =>
      prev.map((p) =>
        p.id === editingPractitioner.id
          ? { ...p, schedules: updatedSchedules, server: selectedServer }
          : p
      )
    )
    
    handleCloseModal()
  }

  const handleDeleteClick = (practitioner) => {
    setPractitionerToDelete(practitioner)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    setPractitionersData((prev) => prev.filter((p) => p.id !== practitionerToDelete.id))
    setShowDeleteModal(false)
    setPractitionerToDelete(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setPractitionerToDelete(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Users className={styles.headerIcon} size={20} />
          <h2 className={styles.title}>Practicantes</h2>
        </div>
        <span className={styles.badge}>{practitioners.length} registrados</span>
      </div>

      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={16} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar practicante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.practitionersList}>
        {filteredPractitioners.map((practitioner) => (
          <div key={practitioner.id} className={styles.practitionerCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.practitionerName}>{practitioner.name}</h3>
                  <span className={styles.serverBadge}>{practitioner.server}</span>
                </div>

                <div className={styles.schedulesWrapper}>
                  <Calendar className={styles.scheduleIcon} size={12} />
                  <div className={styles.schedules}>
                    {practitioner.schedules.map((schedule, idx) => (
                      <div key={idx} className={styles.scheduleItem}>
                        <span className={styles.scheduleDay}>{schedule.day}</span>
                        <span
                          className={`${styles.scheduleTimeBadge} ${
                            schedule.type === 'full'
                              ? styles.scheduleTimeBadgeFull
                              : styles.scheduleTimeBadgePartial
                          }`}
                        >
                          {schedule.time}
                        </span>
                        <span className={styles.scheduleType}>
                          {schedule.type === 'full' ? 'Completa' : 'Parcial'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.iconButton} onClick={() => handleEdit(practitioner)}>
                  <Edit size={16} />
                </button>
                <button
                  className={`${styles.iconButton} ${styles.iconButtonDelete}`}
                  onClick={() => handleDeleteClick(practitioner)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición */}
      {showEditModal && editingPractitioner && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Editar Horario</h3>
              <p className={styles.modalSubtitle}>{editingPractitioner.name}</p>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Servidor</label>
                <select 
                  className={styles.select} 
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                >
                  <option value="Rpsoft">Rpsoft</option>
                  <option value="Innovacion">Innovacion</option>
                  <option value="Laboratorios">Laboratorios</option>
                  <option value="MiniBootcamp">MiniBootcamp</option>
                  <option value="Recuperacion">Recuperacion</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Horarios</label>
                <div className={styles.daysContainer}>
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => {
                    const isEnabled = enabledDays[day] || false
                    const daySchedule = scheduleData[day] || { time: '08:00-14:00', type: 'partial' }
                    const [startTime, endTime] = daySchedule.time.split('-')

                    return (
                      <div key={day} className={styles.dayRow}>
                        <input
                          type="checkbox"
                          className={styles.dayCheckbox}
                          checked={isEnabled}
                          onChange={() => handleDayToggle(day)}
                        />
                        <span className={styles.dayLabel}>{day}</span>
                        <input
                          type="time"
                          className={styles.timeInput}
                          value={startTime}
                          disabled={!isEnabled}
                          min="00:00"
                          max="23:59"
                          onChange={(e) => handleTimeChange(day, 'time', `${e.target.value}-${endTime}`)}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          onMouseDown={(e) => e.preventDefault()}
                          onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                        />
                        <span className={styles.timeSeparator}>-</span>
                        <input
                          type="time"
                          className={styles.timeInput}
                          value={endTime}
                          disabled={!isEnabled}
                          min="00:00"
                          max="23:59"
                          onChange={(e) => handleTimeChange(day, 'time', `${startTime}-${e.target.value}`)}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          onMouseDown={(e) => e.preventDefault()}
                          onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                        />
                        <select
                          className={styles.select}
                          value={daySchedule.type}
                          disabled={!isEnabled}
                          onChange={(e) => handleTimeChange(day, 'type', e.target.value)}
                        >
                          <option value="full">Completa</option>
                          <option value="partial">Parcial</option>
                        </select>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.buttonOutline} onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className={styles.buttonPrimary} onClick={handleSave}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && practitionerToDelete && (
        <div className={styles.modalOverlay} onClick={handleCancelDelete}>
          <div className={styles.deleteModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModalHeader}>
              <div className={styles.deleteIconWrapper}>
                <Trash2 size={24} />
              </div>
              <h3 className={styles.deleteModalTitle}>¿Eliminar practicante?</h3>
              <p className={styles.deleteModalText}>
                ¿Estás seguro de que deseas eliminar a <strong>{practitionerToDelete.name}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.buttonOutline} onClick={handleCancelDelete}>
                Cancelar
              </button>
              <button className={styles.buttonDanger} onClick={handleConfirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
