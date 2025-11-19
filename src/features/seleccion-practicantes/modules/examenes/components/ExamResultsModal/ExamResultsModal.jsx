import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import {
  Award,
  BarChart3,
  Activity,
  Target,
  Clock,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { getExamAttempts } from '../../services'
import styles from './ExamResultsModal.module.css'

const statusLabels = {
  graded: 'Calificado',
  in_progress: 'En progreso',
  submitted: 'En revisión',
  expired: 'Expirado',
  cancelled: 'Cancelado',
}

const statusBadgeClass = {
  graded: styles.statusBadgeGraded,
  in_progress: styles.statusBadgeProgress,
  submitted: styles.statusBadgeWarning,
  expired: styles.statusBadgeExpired,
  cancelled: styles.statusBadgeExpired,
}

const formatDateTime = (value) => {
  if (!value) return 'Sin registro'
  const date = new Date(value)
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const getDuration = (startedAt, submittedAt) => {
  if (!startedAt || !submittedAt) return null
  const diffMs = new Date(submittedAt).getTime() - new Date(startedAt).getTime()
  if (diffMs <= 0) return null
  const minutes = Math.floor(diffMs / 60000)
  const seconds = Math.floor((diffMs % 60000) / 1000)
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

export function ExamResultsModal({ isOpen, onClose, exam }) {
  const toast = useToast()
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(false)
  const isLoadingRef = useRef(false)

  const examId = exam?.id

  const loadAttempts = useCallback(async () => {
    if (!examId || isLoadingRef.current) return

    try {
      isLoadingRef.current = true
      setLoading(true)
      const response = await getExamAttempts(examId)
      const attemptsData =
        response?.results ||
        response?.attempts ||
        (Array.isArray(response) ? response : response?.data) ||
        []
      setAttempts(Array.isArray(attemptsData) ? attemptsData : [])
    } catch (error) {
      console.error('Error al cargar intentos:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'No se pudieron obtener los resultados del examen'
      toast.error(errorMessage)
      setAttempts([])
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId])

  useEffect(() => {
    if (isOpen && examId) {
      loadAttempts()
    } else {
      setAttempts([])
      isLoadingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, examId])

  const orderedAttempts = useMemo(() => {
    return [...attempts].sort((a, b) => {
      const dateA = new Date(a.started_at || a.created_at || 0).getTime()
      const dateB = new Date(b.started_at || b.created_at || 0).getTime()
      return dateB - dateA
    })
  }, [attempts])

  const stats = useMemo(() => {
    if (!orderedAttempts.length) {
      return {
        totalAttempts: 0,
        bestScore: null,
        lastScore: null,
        passRate: null,
      }
    }

    const scores = orderedAttempts
      .map((attempt) => (typeof attempt.score === 'number' ? attempt.score : null))
      .filter((score) => score !== null)

    const passedCount = orderedAttempts.filter((attempt) => attempt.passed).length

    return {
      totalAttempts: orderedAttempts.length,
      bestScore: scores.length ? Math.max(...scores) : null,
      lastScore: scores.length ? scores[0] : null,
      passRate:
        orderedAttempts.length > 0 ? Math.round((passedCount / orderedAttempts.length) * 100) : null,
    }
  }, [orderedAttempts])

  const statusBadge = (status) => {
    const label = statusLabels[status] || status || 'Desconocido'
    const badgeClass = statusBadgeClass[status] || styles.statusBadgeProgress
    return <span className={`${styles.statusBadge} ${badgeClass}`}>{label}</span>
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resultados del examen"
      size="lg"
    >
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroIcon}>
            <Award size={28} />
          </div>
          <div className={styles.heroContent}>
            <h3>{exam?.title || 'Examen'}</h3>
            <p>{exam?.description || 'Revisa el detalle de tus intentos y resultados.'}</p>
          </div>
          {statusBadge(exam?.status)}
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Activity size={20} />
            </div>
            <div>
              <p>Intentos realizados</p>
              <strong>{stats.totalAttempts}</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BarChart3 size={20} />
            </div>
            <div>
              <p>Mejor puntaje</p>
              <strong>
                {stats.bestScore !== null ? `${stats.bestScore.toFixed(2)} / 20` : 'Sin nota'}
              </strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Target size={20} />
            </div>
            <div>
              <p>Promedio actual</p>
              <strong>
                {typeof exam?.average_score === 'number'
                  ? `${exam.average_score.toFixed(2)} / 20`
                  : 'Sin promedio'}
              </strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <p>Tasa de aprobación</p>
              <strong>{stats.passRate !== null ? `${stats.passRate}%` : 'N/A'}</strong>
            </div>
          </div>
        </div>

        <div className={styles.timelineHeader}>
          <h4>Historial de intentos</h4>
          {orderedAttempts.length > 0 && (
            <button
              className={styles.refreshButton}
              onClick={loadAttempts}
              disabled={loading}
            >
              <Loader2 size={16} className={loading ? styles.spinner : ''} />
              Actualizar
            </button>
          )}
        </div>

        <div className={styles.timeline}>
          {loading ? (
            <div className={styles.loadingState}>
              <Skeleton variant="rectangular" width="100%" height={60} style={{ marginBottom: '1rem' }} />
              <Skeleton variant="rectangular" width="100%" height={60} style={{ marginBottom: '1rem' }} />
              <Skeleton variant="rectangular" width="100%" height={60} />
            </div>
          ) : orderedAttempts.length === 0 ? (
            <div className={styles.emptyState}>
              <Clock size={28} />
              <p>Aún no registras intentos calificados para este examen.</p>
            </div>
          ) : (
            orderedAttempts.map((attempt, index) => {
              const duration = getDuration(attempt.started_at, attempt.submitted_at || attempt.graded_at)
              return (
                <div key={attempt.id || index} className={styles.timelineItem}>
                  <div className={styles.timelineIndicator} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeaderRow}>
                      <div>
                        <span className={styles.timelineTitle}>Intento #{orderedAttempts.length - index}</span>
                        <p className={styles.timelineDate}>{formatDateTime(attempt.started_at)}</p>
                      </div>
                      {statusBadge(attempt.status)}
                    </div>

                    <div className={styles.timelineStats}>
                      <div>
                        <p>Puntuación</p>
                        <strong>
                          {typeof attempt.score === 'number' ? `${attempt.score.toFixed(2)} / 20` : 'Sin nota'}
                        </strong>
                      </div>
                      <div>
                        <p>Porcentaje</p>
                        <strong>
                          {typeof attempt.percentage === 'number'
                            ? `${attempt.percentage.toFixed(2)}%`
                            : 'N/A'}
                        </strong>
                      </div>
                      <div>
                        <p>Resultado</p>
                        <strong className={attempt.passed ? styles.passText : styles.failText}>
                          {attempt.passed === true ? 'Aprobado' : attempt.passed === false ? 'No aprobado' : 'Pendiente'}
                        </strong>
                      </div>
                      <div>
                        <p>Duración</p>
                        <strong>{duration || 'En curso'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}

