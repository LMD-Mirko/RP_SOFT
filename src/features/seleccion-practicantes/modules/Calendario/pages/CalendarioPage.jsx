import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Calendar as CalendarIcon } from 'lucide-react'
import { ScheduleForm } from '../components/ScheduleForm'
import { ParticipantsModal } from '../components/ParticipantsModal'
import { MeetingsList } from '../components/MeetingsList'
import { MeetingDetailModal } from '../components/MeetingDetailModal'
import { CalendarDrawer } from '../components/CalendarDrawer'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { Button } from '@shared/components/Button'
import { DatePicker } from '@shared/components/DatePicker'
import { Modal } from '@shared/components/Modal'
import { useCalendario } from '../hooks/useCalendario'
import { useToast } from '@shared/components/Toast'
import styles from './CalendarioPage.module.css'

export function CalendarioPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isCalendarDrawerOpen, setIsCalendarDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [startDateFilter, setStartDateFilter] = useState(null)
  const [endDateFilter, setEndDateFilter] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { reuniones, loading, loadReuniones, createReunion, updateReunion, deleteReunion } = useCalendario()
  const toast = useToast()

  // Cargar reuniones al montar
  useEffect(() => {
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    loadReuniones({
      start_date: startOfMonth.toISOString().split('T')[0],
      end_date: endOfMonth.toISOString().split('T')[0],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mapear reuniones a formato de fechas programadas para el calendario
  const scheduledDates = useMemo(() => {
    const dates = {}
    reuniones.forEach((reunion) => {
      const dateKey = reunion.date // Formato "YYYY-MM-DD" según la API
      if (dateKey) {
        dates[dateKey] = { type: 'green' }
      }
    })
    return dates
  }, [reuniones])

  // Filtrar reuniones por búsqueda y fechas
  const filteredMeetings = useMemo(() => {
    let filtered = reuniones

    // Filtrar por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((meeting) => {
        return (
          meeting.title?.toLowerCase().includes(searchLower) ||
          meeting.interviewer_name?.toLowerCase().includes(searchLower) ||
          meeting.interviewer_email?.toLowerCase().includes(searchLower) ||
          meeting.description?.toLowerCase().includes(searchLower)
        )
      })
    }

    // Filtrar por fecha de inicio
    if (startDateFilter) {
      const startDate = startDateFilter.toISOString().split('T')[0]
      filtered = filtered.filter((meeting) => meeting.date >= startDate)
    }

    // Filtrar por fecha de fin
    if (endDateFilter) {
      const endDate = endDateFilter.toISOString().split('T')[0]
      filtered = filtered.filter((meeting) => meeting.date <= endDate)
    }

    return filtered
  }, [reuniones, searchTerm, startDateFilter, endDateFilter])

  const handleCalendarDateSelect = (date) => {
    setSelectedDate(date)
    // Filtrar por la fecha seleccionada
    setStartDateFilter(date)
    setEndDateFilter(date)
    setIsCalendarDrawerOpen(false)
  }

  const handleSelectParticipants = () => {
    setIsParticipantsModalOpen(true)
  }

  const handleParticipantsConfirm = (participants) => {
    setSelectedParticipants(participants)
    toast.success(`${participants.length} participante(s) seleccionado(s)`)
  }

  const handleFormSubmit = async (formData) => {
    try {
      // Validar que haya participantes
      if (!selectedParticipants || selectedParticipants.length === 0) {
        toast.error('Debes seleccionar al menos un participante')
        return
      }

      // Validar que haya entrevistador
      if (!formData.interviewer) {
        toast.error('Debes seleccionar un entrevistador')
        return
      }

      // Formatear fecha a ISO 8601 (YYYY-MM-DD)
      const date = formData.fecha instanceof Date
        ? `${formData.fecha.getFullYear()}-${String(formData.fecha.getMonth() + 1).padStart(2, '0')}-${String(formData.fecha.getDate()).padStart(2, '0')}`
        : formData.fecha

      // Formatear hora (asegurar formato HH:MM)
      const time = formData.hora.includes(':') ? formData.hora : `${formData.hora}:00`

      // Preparar datos para la API según MEETINGS_API.md
      const reunionData = {
        title: formData.title || formData.motivo, // title es el campo correcto
        date: date,
        time: time,
        duration: parseInt(formData.duration || formData.duracion),
        interviewer: parseInt(formData.interviewer), // user_id del entrevistador
        meeting_link: formData.meeting_link || formData.enlace || '',
        description: formData.description || '',
        participants: selectedParticipants.map((p) => p.id), // Array de user_ids
        send_emails: true, // Enviar emails automáticamente
      }

      if (isEditing && selectedMeeting) {
        // Actualizar reunión existente
        setIsUpdating(true)
        try {
          await updateReunion(selectedMeeting.id, reunionData)
          // Recargar reuniones para actualizar el calendario
          await reloadMeetings()
          // Resetear formulario
          setSelectedParticipants([])
          setSelectedMeeting(null)
          setIsEditing(false)
          setIsFormModalOpen(false)
        } finally {
          setIsUpdating(false)
        }
      } else {
        // Crear nueva reunión
        setIsCreating(true)
        try {
          await createReunion(reunionData)
          // Recargar reuniones para actualizar el calendario
          await reloadMeetings()
          // Resetear formulario
          setSelectedParticipants([])
          setSelectedMeeting(null)
          setIsEditing(false)
          setIsFormModalOpen(false)
        } finally {
          setIsCreating(false)
        }
      }
    } catch (error) {
      console.error('Error al guardar reunión:', error)
      // El error ya se maneja en el hook con toast
    }
  }

  const handleFormCancel = () => {
    setSelectedParticipants([])
    setSelectedDate(new Date())
    setSelectedMeeting(null)
    setIsEditing(false)
    setIsFormModalOpen(false)
  }

  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting)
    setIsDetailModalOpen(true)
  }

  const handleEditMeeting = (meeting) => {
    setSelectedMeeting(meeting)
    setIsEditing(true)
    setIsFormModalOpen(true)
    // Cargar participantes de la reunión
    const participants = (meeting.participants || []).map((p) => ({
      id: p.user_id,
      nombre: p.user_name,
      correo: p.user_email,
    }))
    setSelectedParticipants(participants)
    // Establecer fecha seleccionada
    if (meeting.date) {
      const [year, month, day] = meeting.date.split('-')
      setSelectedDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)))
    }
  }

  const handleDeleteMeeting = (meeting) => {
    setSelectedMeeting(meeting)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedMeeting) {
      setIsDeleting(true)
      try {
        await deleteReunion(selectedMeeting.id)
        setIsDeleteModalOpen(false)
        setSelectedMeeting(null)
        // Recargar reuniones
        const currentDate = new Date()
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        await loadReuniones({
          start_date: startOfMonth.toISOString().split('T')[0],
          end_date: endOfMonth.toISOString().split('T')[0],
        })
      } catch (error) {
        console.error('Error al eliminar reunión:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleNewMeeting = () => {
    setSelectedMeeting(null)
    setIsEditing(false)
    setSelectedParticipants([])
    setSelectedDate(new Date())
    setIsFormModalOpen(true)
  }

  const reloadMeetings = async () => {
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    await loadReuniones({
      start_date: startOfMonth.toISOString().split('T')[0],
      end_date: endOfMonth.toISOString().split('T')[0],
    })
  }

  // Preparar datos iniciales del formulario si estamos editando
  const initialFormData = useMemo(() => {
    if (isEditing && selectedMeeting) {
      const [year, month, day] = selectedMeeting.date.split('-')
      return {
        title: selectedMeeting.title || '',
        fecha: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
        hora: selectedMeeting.time ? selectedMeeting.time.substring(0, 5) : '14:00',
        duration: selectedMeeting.duration?.toString() || '30',
        interviewer: selectedMeeting.interviewer?.toString() || '',
        meeting_link: selectedMeeting.meeting_link || '',
        description: selectedMeeting.description || '',
      }
    }
    return null
  }, [isEditing, selectedMeeting])

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Reuniones</h1>
          <p className={styles.subtitle}>
            Programa y gestiona entrevistas y reuniones
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNewMeeting}
          icon={Plus}
          iconPosition="left"
        >
          Nueva Reunión
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por título, entrevistador o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filtersRow}>
          <div className={styles.dateFilters}>
            <div className={styles.dateFilter}>
              <CalendarIcon size={18} className={styles.filterIcon} />
              <DatePicker
                selected={startDateFilter}
                onChange={setStartDateFilter}
                placeholderText="Fecha desde"
                isClearable
              />
            </div>
            <div className={styles.dateFilter}>
              <CalendarIcon size={18} className={styles.filterIcon} />
              <DatePicker
                selected={endDateFilter}
                onChange={setEndDateFilter}
                placeholderText="Fecha hasta"
                isClearable
              />
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsCalendarDrawerOpen(true)}
            icon={CalendarIcon}
            iconPosition="left"
          >
            Ver Calendario
          </Button>
        </div>
      </div>

      {/* Lista de Reuniones */}
      <div className={styles.tableSection}>
        <MeetingsList
          meetings={filteredMeetings}
          loading={loading}
          onView={handleViewMeeting}
          onEdit={handleEditMeeting}
          onDelete={handleDeleteMeeting}
        />
      </div>

      {/* Modal de Participantes */}
      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        selectedParticipants={selectedParticipants.map((p) => p.id)}
        onConfirm={handleParticipantsConfirm}
      />

      {/* Modal de Detalles */}
      <MeetingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedMeeting(null)
        }}
        meeting={selectedMeeting}
        onEdit={handleEditMeeting}
      />

      {/* Modal de Formulario (Crear/Editar) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={isCreating || isUpdating ? undefined : handleFormCancel}
        title={isEditing ? 'Editar Reunión' : 'Nueva Reunión'}
        size="lg"
        closeOnOverlayClick={!isCreating && !isUpdating}
      >
        <ScheduleForm
          selectedDate={selectedDate}
          onSelectParticipants={handleSelectParticipants}
          participants={selectedParticipants}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={initialFormData}
          isEditing={isEditing}
          isLoading={isCreating || isUpdating}
        />
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false)
            setSelectedMeeting(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Reunión"
        message={`¿Estás seguro de que deseas eliminar la reunión "${selectedMeeting?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Calendario Drawer */}
      <CalendarDrawer
        isOpen={isCalendarDrawerOpen}
        onClose={() => setIsCalendarDrawerOpen(false)}
        selectedDate={selectedDate}
        onDateSelect={handleCalendarDateSelect}
        scheduledDates={scheduledDates}
        meetings={reuniones}
      />
    </div>
  )
}

