import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, User, Calendar, Clock, Users, Video, Loader2, BookOpen, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '@shared/context/UserProfileContext'
import dayjs from 'dayjs'
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
      queryParams.append('page_size', '20')

      const endpoint = `meetings/my-meetings/?${queryParams.toString()}`
      const response = await get(endpoint)
      
      const now = dayjs()
      const today = now.format('YYYY-MM-DD')
      
      const allItems = (response.results || []).filter((item) => {
        if (item.type === 'meeting') {
          if (!item.date || !item.time) return false
          // Combinar fecha y hora usando dayjs
          // item.date viene como "2025-11-19" (YYYY-MM-DD)
          // item.time viene como "20:05:00" (HH:mm:ss)
          const [hours, minutes] = item.time.substring(0, 5).split(':').map(Number)
          // Parsear la fecha y establecer la hora
          const meetingDate = dayjs(item.date)
          const meetingDateTime = meetingDate.hour(hours).minute(minutes).second(0).millisecond(0)
          // Solo mostrar reuniones que aún no han pasado (comparación precisa con hora)
          return meetingDateTime.isAfter(now)
        } else if (item.type === 'exam') {
          // Filtrar exámenes que aún no han expirado
          if (item.end_date) {
            // Parsear la fecha de fin (viene en formato ISO con timezone UTC: "2025-11-28T05:00:00+00:00")
            // dayjs parsea correctamente las fechas ISO con timezone y las convierte a hora local
            const endDate = dayjs(item.end_date)
            // Obtener el final del día de la fecha de fin en hora local
            const endOfDay = endDate.endOf('day')
            // Comparar si el final del día de la fecha de fin es después de ahora
            // Esto asegura que si el examen expira hoy, aún se muestre hasta el final del día
            return endOfDay.isAfter(now)
          }
          // Si no hay fecha de fin, no mostrar (probablemente es un error de datos)
          return false
        }
        return false
      })
      
      setMeetings(allItems)
    } catch (error) {
      console.error('Error al cargar notificaciones:', error)
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

  const upcomingCount = meetings.length
  const meetingsCount = meetings.filter(m => m.type === 'meeting').length
  const examsCount = meetings.filter(m => m.type === 'exam').length

  const handleExamClick = (examId) => {
    navigate(`/seleccion-practicantes/examenes/${examId}/realizar`)
    setIsNotificationsOpen(false)
  }

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
              {upcomingCount > 0 && (
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
                  <h3 className={styles.notificationsTitle}>Notificaciones</h3>
                  <span className={styles.notificationsSubtitle}>
                    {upcomingCount > 0 
                      ? `${meetingsCount} reunión${meetingsCount !== 1 ? 'es' : ''}, ${examsCount} examen${examsCount !== 1 ? 'es' : ''}`
                      : 'No hay notificaciones'}
                  </span>
                </div>

                <div className={styles.notificationsContent}>
                  {loading ? (
                    <div className={styles.loadingState}>
                      <Loader2 size={24} className={styles.spinner} />
                      <p>Cargando notificaciones...</p>
                    </div>
                  ) : meetings.length > 0 ? (
                    <div className={styles.meetingsList}>
                      {meetings.map((item) => {
                        if (item.type === 'meeting') {
                          return (
                            <div key={item.id} className={styles.meetingItem}>
                          <div className={styles.meetingIcon}>
                            <Calendar size={16} />
                          </div>
                          <div className={styles.meetingInfo}>
                                <h4 className={styles.meetingTitle}>{item.title}</h4>
                            <div className={styles.meetingDetails}>
                              <span className={styles.meetingDate}>
                                <Calendar size={12} />
                                    {formatDate(item.date)}
                              </span>
                              <span className={styles.meetingTime}>
                                <Clock size={12} />
                                    {formatTime(item.time)}
                              </span>
                                  {item.participants && item.participants.length > 0 && (
                                <span className={styles.meetingParticipants}>
                                  <Users size={12} />
                                      {item.participants.length}
                                </span>
                              )}
                            </div>
                                {item.meeting_link && (
                              <a
                                    href={item.meeting_link}
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
                          )
                        } else if (item.type === 'exam') {
                          return (
                            <div 
                              key={item.id} 
                              className={styles.meetingItem}
                              onClick={() => item.can_start && handleExamClick(item.id)}
                              style={{ cursor: item.can_start ? 'pointer' : 'default' }}
                            >
                              <div className={styles.meetingIcon} style={{ background: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)' }}>
                                <BookOpen size={16} />
                              </div>
                              <div className={styles.meetingInfo}>
                                <h4 className={styles.meetingTitle}>{item.title}</h4>
                                <div className={styles.meetingDetails}>
                                  <span className={styles.meetingDate}>
                                    <Calendar size={12} />
                                    Hasta {formatDate(item.end_date)}
                                  </span>
                                  {item.time_limit_minutes && (
                                    <span className={styles.meetingTime}>
                                      <Clock size={12} />
                                      {item.time_limit_minutes} min
                                    </span>
                                  )}
                                  {item.attempts_count > 0 && (
                                    <span className={styles.meetingParticipants}>
                                      <BookOpen size={12} />
                                      {item.attempts_count} intento{item.attempts_count !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                                {item.can_start && (
                                  <div className={styles.meetingLink} style={{ cursor: 'pointer' }}>
                                    <Play size={12} />
                                    Iniciar Examen
                                  </div>
                                )}
                                {item.status === 'completed' && (
                                  <div className={styles.meetingLink}>
                                    <BookOpen size={12} />
                                    Completado
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Calendar size={48} className={styles.emptyIcon} />
                      <p>No tienes notificaciones</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className={styles.avatarButton}
            aria-label="Usuario"
            onClick={() => navigate('/configuracion/global/perfil')}
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
