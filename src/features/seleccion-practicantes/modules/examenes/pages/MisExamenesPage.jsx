import { BookOpen, Clock, CheckCircle2, AlertCircle, Play, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '../../../services/methods'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './MisExamenesPage.module.css'

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function MisExamenesPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [examenes, setExamenes] = useState([])

  useEffect(() => {
    loadExamenes()
  }, [])

  const loadExamenes = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      queryParams.append('upcoming', 'true')
      queryParams.append('page_size', '100')

      const endpoint = `meetings/my-meetings/?${queryParams.toString()}`
      const response = await get(endpoint)
      
      // Filtrar solo exámenes
      const examenesData = (response.results || []).filter((item) => item.type === 'exam')
      setExamenes(examenesData)
    } catch (error) {
      console.error('Error al cargar exámenes:', error)
      toast.error('Error al cargar tus exámenes')
    } finally {
      setLoading(false)
    }
  }

  const handleStartExam = (examId) => {
    navigate(`/seleccion-practicantes/examenes/${examId}/realizar`)
  }

  const handleViewResults = (examId) => {
    // TODO: Navegar a vista de resultados
    toast.info('Vista de resultados próximamente')
  }

  const getStatusBadge = (exam) => {
    if (exam.status === 'completed') {
      return (
        <span className={styles.statusBadgeCompleted}>
          <CheckCircle2 size={14} />
          Completado
        </span>
      )
    }
    if (exam.status === 'started') {
      return (
        <span className={styles.statusBadgeStarted}>
          <Clock size={14} />
          En Progreso
        </span>
      )
    }
    if (exam.status === 'expired') {
      return (
        <span className={styles.statusBadgeExpired}>
          <AlertCircle size={14} />
          Expirado
        </span>
      )
    }
    return (
      <span className={styles.statusBadgeAssigned}>
        <BookOpen size={14} />
        Asignado
      </span>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={300} height={20} />
        </div>
        <div className={styles.content}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={200} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Exámenes</h1>
          <p className={styles.subtitle}>Exámenes asignados y completados</p>
        </div>
      </div>

      <div className={styles.content}>
        {examenes.length === 0 ? (
          <EmptyState
            title="No tienes exámenes asignados"
            message="Cuando te asignen un examen, aparecerá aquí."
          />
        ) : (
          <div className={styles.examsList}>
            {examenes.map((exam) => (
              <div key={exam.id} className={styles.examCard}>
                <div className={styles.examHeader}>
                  <div className={styles.examInfo}>
                    <h3 className={styles.examTitle}>{exam.title}</h3>
                    <p className={styles.examDescription}>{exam.description || 'Sin descripción'}</p>
                  </div>
                  {getStatusBadge(exam)}
                </div>

                <div className={styles.examDetails}>
                  <div className={styles.detailRow}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Fecha Inicio:</span>
                      <span className={styles.detailValue}>{formatDate(exam.start_date)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Fecha Fin:</span>
                      <span className={styles.detailValue}>{formatDate(exam.end_date)}</span>
                    </div>
                  </div>
                  {exam.time_limit_minutes && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Tiempo Límite:</span>
                      <span className={styles.detailValue}>{exam.time_limit_minutes} minutos</span>
                    </div>
                  )}
                  {exam.attempts_count > 0 && (
                    <div className={styles.detailRow}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Intentos:</span>
                        <span className={styles.detailValue}>{exam.attempts_count}</span>
                      </div>
                      {exam.average_score !== null && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Promedio:</span>
                          <span className={styles.detailValue}>{exam.average_score?.toFixed(2)} / 20</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.examActions}>
                  {exam.can_start && exam.status === 'assigned' && (
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      className={styles.actionButtonPrimary}
                    >
                      <Play size={18} />
                      Iniciar Examen
                    </button>
                  )}
                  {exam.has_active_attempt && (
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      className={styles.actionButtonPrimary}
                    >
                      <Play size={18} />
                      Continuar Examen
                    </button>
                  )}
                  {exam.status === 'completed' && (
                    <button
                      onClick={() => handleViewResults(exam.id)}
                      className={styles.actionButtonSecondary}
                    >
                      <Eye size={18} />
                      Ver Resultados
                    </button>
                  )}
                  {exam.status === 'expired' && (
                    <span className={styles.expiredMessage}>Este examen ha expirado</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

