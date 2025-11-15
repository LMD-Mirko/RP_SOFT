import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, User, Calendar, Clock, Users, Video, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '@shared/context/UserProfileContext'
import styles from './Header.module.css'

export function Header() {
  const navigate = useNavigate()
  const { profileImageUrl } = useUserProfile()
  const [imageKey, setImageKey] = useState(0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const notificationsRef = useRef(null)

  // Escuchar cambios en la imagen de perfil para forzar actualización
  useEffect(() => {
    const handleProfileUpdate = () => {
      // Incrementar el key para forzar el re-render de la imagen
      setImageKey(prev => prev + 1)
    }

    window.addEventListener('userProfileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate)
    }
  }, [])

  // Servicio de notificaciones
  const loadMeetings = useCallback(async () => {
    setLoading(true)
    try {
      // Importar dinámicamente para evitar dependencias circulares
      const { get } = await import('../../../../features/seleccion-practicantes/services/methods')
      
      const queryParams = new URLSearchParams()
      queryParams.append('upcoming', 'true')
      queryParams.append('page_size', '10')

      const endpoint = `meetings/my-meetings/?${queryParams.toString()}`
      const response = await get(endpoint)
      
      // Filtrar reuniones que ya pasaron
      const now = new Date()
      const upcomingMeetings = (response.results || []).filter((meeting) => {
        if (!meeting.date || !meeting.time) return false
        
        // Crear fecha completa de la reunión
        const [year, month, day] = meeting.date.split('-').map(Number)
        const [hours, minutes] = meeting.time.substring(0, 5).split(':').map(Number)
        const meetingDateTime = new Date(year, month - 1, day, hours, minutes)
        
        // Solo mostrar si la fecha/hora es futura
        return meetingDateTime > now
      })
      
      setMeetings(upcomingMeetings)
    } catch (error) {
      console.error('Error al cargar reuniones:', error)
      setMeetings([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar reuniones al montar y cuando se abre el dropdown
  useEffect(() => {
    loadMeetings()
  }, [loadMeetings])

  useEffect(() => {
    if (isNotificationsOpen) {
      loadMeetings()
    }
  }, [isNotificationsOpen, loadMeetings])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationsOpen])

  // Obtener iniciales del usuario desde localStorage
  const getUserInitials = () => {
    try {
      const userData = localStorage.getItem('rpsoft_user')
      if (userData) {
        const user = JSON.parse(userData)
        const name = user.name || ''
        const paternalLastname = user.paternal_lastname || ''
        if (name && paternalLastname) {
          return `${name[0]}${paternalLastname[0]}`.toUpperCase()
        }
        if (name) {
          return name[0].toUpperCase()
        }
        if (user.email) {
          return user.email[0].toUpperCase()
        }
      }
    } catch (error) {
      console.error('Error al obtener iniciales:', error)
    }
    return 'U'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return '-'
    const time = timeString.substring(0, 5)
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const upcomingMeetingsCount = meetings.length

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.actions}>
          <div className={styles.notificationsWrapper} ref={notificationsRef}>
            <button 
              className={styles.iconButton} 
              aria-label="Notificaciones"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell size={20} className={styles.icon} />
              {upcomingMeetingsCount > 0 && (
                <span className={styles.notificationBadge}></span>
              )}
            </button>

            {/* Overlay oscuro */}
            {isNotificationsOpen && (
              <div 
                className={styles.overlay}
                onClick={() => setIsNotificationsOpen(false)}
              />
            )}

            {/* Dropdown de Notificaciones */}
            {isNotificationsOpen && (
              <div className={styles.notificationsDropdown}>
                <div className={styles.notificationsHeader}>
                  <h3 className={styles.notificationsTitle}>Mis Reuniones</h3>
                  <span className={styles.notificationsSubtitle}>
                    {upcomingMeetingsCount > 0 
                      ? `${upcomingMeetingsCount} reunión${upcomingMeetingsCount > 1 ? 'es' : ''} próximas`
                      : 'No hay reuniones próximas'}
                  </span>
                </div>

                <div className={styles.notificationsContent}>
                  {loading ? (
                    <div className={styles.loadingState}>
                      <Loader2 size={24} className={styles.spinner} />
                      <p>Cargando reuniones...</p>
                    </div>
                  ) : meetings.length > 0 ? (
                    <div className={styles.meetingsList}>
                      {meetings.map((meeting) => (
                        <div key={meeting.id} className={styles.meetingItem}>
                          <div className={styles.meetingIcon}>
                            <Calendar size={16} />
                          </div>
                          <div className={styles.meetingInfo}>
                            <h4 className={styles.meetingTitle}>{meeting.title}</h4>
                            <div className={styles.meetingDetails}>
                              <span className={styles.meetingDate}>
                                <Calendar size={12} />
                                {formatDate(meeting.date)}
                              </span>
                              <span className={styles.meetingTime}>
                                <Clock size={12} />
                                {formatTime(meeting.time)}
                              </span>
                              {meeting.participants && meeting.participants.length > 0 && (
                                <span className={styles.meetingParticipants}>
                                  <Users size={12} />
                                  {meeting.participants.length}
                                </span>
                              )}
                            </div>
                            {meeting.meeting_link && (
                              <a
                                href={meeting.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.meetingLink}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Video size={12} />
                                Unirse a la reunión
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Calendar size={48} className={styles.emptyIcon} />
                      <p>No tienes reuniones próximas</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className={styles.avatarButton}
            aria-label="Usuario"
            onClick={() => navigate('/seleccion-practicantes/perfil')}
          >
            <div className={styles.avatar}>
              {profileImageUrl ? (
                <img 
                  key={`${imageKey}-${profileImageUrl}`}
                  src={profileImageUrl}
                  alt="Perfil" 
                  className={styles.avatarImage}
                  onError={(e) => {
                    // Si falla la carga, mostrar iniciales
                    e.target.style.display = 'none'
                    const parent = e.target.parentElement
                    if (parent && !parent.querySelector(`.${styles.avatarText}`)) {
                      const span = document.createElement('span')
                      span.className = styles.avatarText
                      span.textContent = getUserInitials()
                      parent.appendChild(span)
                    }
                  }}
                />
              ) : (
                <span className={styles.avatarText}>{getUserInitials()}</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

