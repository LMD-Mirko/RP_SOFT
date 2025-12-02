import { useState, useEffect } from 'react'
import { X, User, Loader2, Mail, UserCheck } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { getExamAssignments } from '../../services'
import { useToast } from '@shared/components/Toast'
import styles from './ExamParticipantsModal.module.css'

export function ExamParticipantsModal({ isOpen, onClose, examId, examTitle }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    if (isOpen && examId) {
      loadAssignments()
    } else {
      setAssignments([])
    }
  }, [isOpen, examId])

  const loadAssignments = async () => {
    try {
      setLoading(true)
      const response = await getExamAssignments(examId)
      // Según la guía, la respuesta tiene "members" array
      setAssignments(response.members || response.assignments || response.results || response || [])
    } catch (error) {
      console.error('Error al cargar participantes:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al cargar los participantes del examen'
      toast.error(errorMessage)
      setAssignments([])
    } finally {
      setLoading(false)
    }
  }

  const getFullName = (member) => {
    // Según la guía, viene como "full_name"
    if (member.full_name) {
      return member.full_name
    }
    // Fallback para compatibilidad
    if (member.user_name) {
      return member.user_name
    }
    if (member.user) {
      const user = member.user
      return `${user.name || ''} ${user.paternal_lastname || ''} ${user.maternal_lastname || ''}`.trim() || 'Sin nombre'
    }
    return 'Sin nombre'
  }

  const getEmail = (member) => {
    // Según la guía, viene como "email"
    return member.email || member.user_email || member.user?.email || 'Sin email'
  }

  const getStatus = (member) => {
    // Según la guía: "assigned", "started", "completed", "expired"
    return member.status || 'assigned'
  }

  const getStatusLabel = (status) => {
    const labels = {
      assigned: 'Asignado',
      started: 'En Progreso',
      completed: 'Completado',
      expired: 'Expirado'
    }
    return labels[status] || status
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Participantes del Examen`}
      size="md"
    >
      <div className={styles.container}>
        {examTitle && (
          <div className={styles.examTitle}>
            <h3>{examTitle}</h3>
          </div>
        )}

        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={32} className={styles.spinner} />
            <p>Cargando participantes...</p>
          </div>
        ) : assignments.length > 0 ? (
          <div className={styles.participantsList}>
            {assignments.map((member, index) => {
              const fullName = getFullName(member)
              const email = getEmail(member)
              const status = getStatus(member)
              const averageScore = member.average_score !== null && member.average_score !== undefined
                ? member.average_score.toFixed(2)
                : null
              const attemptsCount = member.attempts_count || 0
              const assignedAt = member.assigned_at

              return (
                <div key={member.assignment_id || member.id || member.user_id || index} className={styles.participantItem}>
                  <div className={styles.participantInfo}>
                    <div className={styles.avatar}>
                      <User size={20} />
                    </div>
                    <div className={styles.participantDetails}>
                      <div className={styles.participantHeader}>
                        <p className={styles.participantName}>{fullName}</p>
                        <span className={`${styles.statusBadge} ${
                          status === 'assigned' ? styles.statusBadgeAssigned :
                          status === 'started' ? styles.statusBadgeStarted :
                          status === 'completed' ? styles.statusBadgeCompleted :
                          status === 'expired' ? styles.statusBadgeExpired :
                          styles.statusBadgeAssigned
                        }`}>
                          {getStatusLabel(status)}
                        </span>
                      </div>
                      <div className={styles.participantEmail}>
                        <Mail size={14} />
                        <span>{email}</span>
                      </div>
                      {(averageScore !== null || attemptsCount > 0 || assignedAt) && (
                        <div className={styles.participantStats}>
                          {averageScore !== null && (
                            <span className={styles.statItem}>
                              <UserCheck size={14} />
                              Promedio: {averageScore} / 20
                            </span>
                          )}
                          {attemptsCount > 0 && (
                            <span className={styles.statItem}>
                              Intentos: {attemptsCount}
                            </span>
                          )}
                          {assignedAt && (
                            <span className={styles.statItem}>
                              Asignado: {formatDate(assignedAt)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <User size={48} className={styles.emptyIcon} />
            <p>No hay participantes asignados a este examen</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

