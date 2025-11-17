import { Calendar, Clock, User, Users, Link as LinkIcon, Mail, FileText, CalendarDays, UserPlus, Hash, Video } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import styles from './MeetingDetailModal.module.css'
import clsx from 'clsx'

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

const formatDateTime = (dateString) => {
  if (!dateString) return 'No especificada'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MeetingDetailModal({ isOpen, onClose, meeting, onEdit }) {
  if (!meeting) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Reunión"
      size="md"
    >
      <div className={styles.content}>
        {/* Header con Avatar */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            <Calendar size={28} />
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.titulo}>{meeting.title}</h3>
            <p className={styles.fechaHora}>
              {formatDate(meeting.date)} • {formatTime(meeting.time)}
            </p>
          </div>
        </div>

        {/* Información General */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información General</h4>
          <div className={styles.detailsGrid}>
            <div className={styles.detailRow}>
              <Hash size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>ID</span>
                <p className={styles.detailValue}>#{meeting.id}</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <CalendarDays size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Fecha</span>
                <p className={styles.detailValue}>{formatDate(meeting.date)}</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <Clock size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Hora y Duración</span>
                <p className={styles.detailValue}>
                  {formatTime(meeting.time)} ({meeting.duration} minutos)
                </p>
              </div>
            </div>

            {meeting.description && (
              <div className={styles.detailRow}>
                <FileText size={16} className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Descripción</span>
                  <p className={styles.detailValue}>{meeting.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información de la Reunión */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información de la Reunión</h4>
          <div className={styles.processSection}>
            <div className={styles.processItem}>
              <User size={16} className={clsx(styles.processIcon, styles.icon_user)} />
              <div className={styles.processContent}>
                <span className={styles.processLabel}>Entrevistador</span>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{meeting.interviewer_name || '-'}</span>
                  {meeting.interviewer_email && (
                    <span className={styles.userEmail}>
                      <Mail size={12} />
                      {meeting.interviewer_email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {meeting.meeting_link && (
              <div className={styles.processItem}>
                <Video size={16} className={clsx(styles.processIcon, styles.icon_link)} />
                <div className={styles.processContent}>
                  <span className={styles.processLabel}>Enlace de la Reunión</span>
                  <a
                    href={meeting.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {meeting.meeting_link}
                  </a>
                </div>
              </div>
            )}

            <div className={styles.processItem}>
              <Users size={16} className={clsx(styles.processIcon, styles.icon_participants)} />
              <div className={styles.processContent}>
                <span className={styles.processLabel}>Participantes</span>
                <span className={styles.participantsCount}>
                  {meeting.participants?.length || 0} participante(s)
                </span>
              </div>
            </div>
          </div>

          {/* Lista de Participantes */}
          {meeting.participants && meeting.participants.length > 0 && (
            <div className={styles.participantsSection}>
              <div className={styles.participantsList}>
                {meeting.participants.map((participant) => (
                  <div key={participant.id} className={styles.participantItem}>
                    <User size={14} className={styles.participantIcon} />
                    <div className={styles.participantInfo}>
                      <span className={styles.participantName}>{participant.user_name}</span>
                      <span className={styles.participantEmail}>
                        <Mail size={12} />
                        {participant.user_email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Información del Sistema */}
        {(meeting.created_at || meeting.updated_at || meeting.created_by) && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Información del Sistema</h4>
            <div className={styles.processSection}>
              {meeting.created_at && (
                <div className={styles.processItem}>
                  <Calendar size={16} className={styles.processIcon} />
                  <div className={styles.processContent}>
                    <span className={styles.processLabel}>Fecha de Creación</span>
                    <span className={styles.fecha}>{formatDateTime(meeting.created_at)}</span>
                  </div>
                </div>
              )}

              {meeting.updated_at && meeting.updated_at !== meeting.created_at && (
                <div className={styles.processItem}>
                  <Calendar size={16} className={styles.processIcon} />
                  <div className={styles.processContent}>
                    <span className={styles.processLabel}>Última Actualización</span>
                    <span className={styles.fecha}>{formatDateTime(meeting.updated_at)}</span>
                  </div>
                </div>
              )}

              {meeting.created_by && (
                <div className={styles.processItem}>
                  <UserPlus size={16} className={styles.processIcon} />
                  <div className={styles.processContent}>
                    <span className={styles.processLabel}>Creado por</span>
                    <span className={styles.fecha}>Usuario ID: {meeting.created_by}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
          >
            Cerrar
          </Button>
          {onEdit && (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onEdit(meeting)
                onClose()
              }}
              fullWidth
            >
              Editar
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

