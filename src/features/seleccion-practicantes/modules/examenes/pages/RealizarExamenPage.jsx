import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Target,
  Award,
  Layers,
} from 'lucide-react'
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getExamView,
  getExamActiveAttempt,
  startExamAttempt,
  saveAnswersBatch,
  gradeAttempt,
} from '../services'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EmptyState } from '@shared/components/EmptyState'
import { Button } from '@shared/components/Button'
import styles from './RealizarExamenPage.module.css'

export function RealizarExamenPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [examen, setExamen] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [preguntas, setPreguntas] = useState([])
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGraded, setIsGraded] = useState(false)
  const [result, setResult] = useState(null)
  const [accessError, setAccessError] = useState(null)
  const resumeToastShown = useRef(false)
  const isLoadingRef = useRef(false)
  const attemptStorageKey = `exam_attempt_${examId}`

  function computeAttemptsInfo(examData) {
    if (!examData) {
      return {
        maxAttemptsValue: Number.POSITIVE_INFINITY,
        attemptsUsed: 0,
        remaining: Number.POSITIVE_INFINITY,
        hasRemaining: true,
      }
    }
    const maxAttemptsValue =
      typeof examData?.max_attempts === 'number' && examData.max_attempts > 0
        ? examData.max_attempts
        : Number.POSITIVE_INFINITY
    const attemptsUsed = examData?.assignment?.attempts_count ?? 0
    const remaining =
      maxAttemptsValue === Number.POSITIVE_INFINITY
        ? Number.POSITIVE_INFINITY
        : Math.max(maxAttemptsValue - attemptsUsed, 0)
    return {
      maxAttemptsValue,
      attemptsUsed,
      remaining,
      hasRemaining: attemptsUsed < maxAttemptsValue,
    }
  }

  const attemptsInfo = useMemo(() => computeAttemptsInfo(examen), [examen])

  const mapAnswersArrayToState = (answersArray = []) => {
    const mapped = {}
    answersArray.forEach((answer) => {
      if (!answer?.question_id) return
      mapped[answer.question_id] = {
        question_id: answer.question_id,
        selected_option_id: answer.selected_option_id ?? null,
        text_answer: answer.text_answer ?? '',
      }
    })
    return mapped
  }

  const saveAttemptToStorage = (attemptData) => {
    try {
      if (typeof window === 'undefined') return
      if (!attemptData) return
      localStorage.setItem(
        attemptStorageKey,
        JSON.stringify({
          ...attemptData,
          exam_id: attemptData.exam_id || examId,
        })
      )
    } catch (error) {
      console.error('Error al guardar intento en storage:', error)
    }
  }

  const getStoredAttempt = () => {
    try {
      if (typeof window === 'undefined') return null
      const stored = localStorage.getItem(attemptStorageKey)
      if (!stored) return null
      const parsed = JSON.parse(stored)
      if (parsed.exam_id && parsed.exam_id !== examId) {
        return null
      }
      return parsed
    } catch (error) {
      console.error('Error al leer intento desde storage:', error)
      return null
    }
  }

  const clearStoredAttempt = () => {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(attemptStorageKey)
    } catch (error) {
      console.error('Error al limpiar intento del storage:', error)
    }
  }

  const computeExpiresAt = (attemptData, examData) => {
    if (attemptData?.expires_at) {
      return attemptData.expires_at
    }
    if (!examData?.time_limit_minutes || !attemptData?.started_at) {
      return null
    }

    const expiresTimestamp =
      new Date(attemptData.started_at).getTime() + examData.time_limit_minutes * 60000
    return new Date(expiresTimestamp).toISOString()
  }

  const applyAttemptData = (attemptData, examData) => {
    if (!attemptData) return
    const expiresAt = computeExpiresAt(attemptData, examData || examen)
    const normalizedAttempt = {
      ...attemptData,
      expires_at: expiresAt,
    }

    setAttempt(normalizedAttempt)
    setIsGraded(false)
    setResult(null)
    saveAttemptToStorage(normalizedAttempt)

    if (expiresAt) {
      const remaining = Math.max(0, new Date(expiresAt).getTime() - new Date().getTime())
      setTimeRemaining(remaining)
    } else {
      setTimeRemaining(null)
    }
  }

  const tryResumeAttemptFromStorage = (examData, assignmentData) => {
    const storedAttempt = getStoredAttempt()
    if (!storedAttempt) return false

    if (assignmentData?.status === 'completed' || assignmentData?.status === 'expired') {
      clearStoredAttempt()
      return false
    }

    applyAttemptData(storedAttempt, examData)
    setAnswers({})
    return true
  }

  const resumeAttemptFromServer = async (examData, { notify = false } = {}) => {
    if (!examId) return false

    try {
      const response = await getExamActiveAttempt(examId)
      const activeAttempt =
        response?.active_attempt ||
        response?.attempt ||
        (response?.id && response?.status === 'in_progress' ? response : null)

      if (activeAttempt && activeAttempt.status === 'in_progress') {
        applyAttemptData(activeAttempt, examData)

        if (Array.isArray(response?.answers)) {
          setAnswers(mapAnswersArrayToState(response.answers))
        }

        if (notify && !resumeToastShown.current) {
          resumeToastShown.current = true
          toast.info('Retomaste tu intento en progreso')
        }
        return true
      }
    } catch (error) {
      console.error('Error al recuperar intento activo:', error)
    }

    return false
  }

  const handleStartAttempt = useCallback(async (currentExamData = examen) => {
    if (isGraded || isLoadingRef.current) return

    try {
      resumeToastShown.current = false
      setAnswers({})
      isLoadingRef.current = true
      setLoading(true)
      const attemptData = await startExamAttempt(examId)
      applyAttemptData(attemptData, currentExamData)
    } catch (error) {
      console.error('Error al iniciar intento:', error)

      const fallbackExamData = currentExamData || examen
      if (fallbackExamData) {
        const resumed = await resumeAttemptFromServer(fallbackExamData, { notify: true })
        if (resumed) {
          isLoadingRef.current = false
          setLoading(false)
          return
        }
      }

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al iniciar el examen'
      setAccessError(errorMessage)
      toast.error(errorMessage)
    } finally {
      isLoadingRef.current = false
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, isGraded])

  const loadExam = useCallback(async () => {
    if (!examId || isLoadingRef.current || isGraded) return

    try {
      isLoadingRef.current = true
      setLoading(true)
      const examData = await getExamView(examId)
      
      // Si el examen ya está calificado, no continuar
      if (isGraded) {
        setLoading(false)
        isLoadingRef.current = false
        return
      }

      setExamen(examData)
      setPreguntas(examData.questions || [])
      const assignmentData = examData.assignment || null
      setAccessError(null)
      resumeToastShown.current = false

      // Calcular attemptsInfo localmente
      const localAttemptsInfo = computeAttemptsInfo(examData)
      if (assignmentData?.status === 'completed') {
        if (!localAttemptsInfo.hasRemaining) {
          clearStoredAttempt()
          setAccessError('Ya completaste el número máximo de intentos permitidos para este examen.')
          setLoading(false)
          isLoadingRef.current = false
          return
        }
      }

      if (assignmentData?.status === 'expired') {
        clearStoredAttempt()
        setAccessError('Este examen expiró y ya no puede ser respondido.')
        setLoading(false)
        isLoadingRef.current = false
        return
      }

      const resumedFromServer = await resumeAttemptFromServer(examData, {
        notify: assignmentData?.status === 'started' || assignmentData?.has_active_attempt,
      })
      if (resumedFromServer) {
        setLoading(false)
        isLoadingRef.current = false
        return
      }

      const resumedFromStorage = tryResumeAttemptFromStorage(examData, assignmentData)
      if (resumedFromStorage) {
        setLoading(false)
        isLoadingRef.current = false
        return
      }
      
      // Iniciar intento solo si no hay un intento activo y el examen no está calificado
      if (!attempt && !isGraded) {
        await handleStartAttempt(examData)
      }
    } catch (error) {
      console.error('Error al cargar examen:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'No se pudo cargar el examen asignado'
      setAccessError(errorMessage)
      toast.error(errorMessage)

      if (error.response?.status === 404) {
        setTimeout(() => {
          navigate('/seleccion-practicantes')
        }, 2000)
      }
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId])

  useEffect(() => {
    if (!isGraded && examId && !isLoadingRef.current) {
      loadExam()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId])

  const handleSubmit = useCallback(async () => {
    if (!attempt?.id || isSubmitting || isGraded || isLoadingRef.current) return

    try {
      setIsSubmitting(true)
      setLoading(true)
      isLoadingRef.current = true
      
      // Guardar respuestas antes de calificar
      const answersArray = Object.values(answers)
      if (answersArray.length > 0) {
        await saveAnswersBatch(attempt.id, { answers: answersArray })
      }

      // Calificar
      const gradeResult = await gradeAttempt(attempt.id)
      setResult(gradeResult)
      setIsGraded(true)
      setExamen((prev) => {
        if (!prev) return prev
        const prevAssignment = prev.assignment || {}
        const attemptsCount = (prevAssignment.attempts_count || 0) + 1
        return {
          ...prev,
          assignment: {
            ...prevAssignment,
            attempts_count: attemptsCount,
            status: 'completed',
          },
        }
      })
      clearStoredAttempt()
      
      toast.success('Examen completado y calificado exitosamente')
    } catch (error) {
      console.error('Error al finalizar examen:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al finalizar el examen'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [attempt, answers, isSubmitting, isGraded])

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting || isGraded) return
    
    toast.error('El tiempo se ha agotado. Enviando examen automáticamente...')
    await handleSubmit()
  }, [isSubmitting, isGraded, handleSubmit])

  useEffect(() => {
    if (attempt && attempt.expires_at && !isGraded) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const expires = new Date(attempt.expires_at).getTime()
        const remaining = Math.max(0, expires - now)
        
        if (remaining === 0) {
          clearInterval(interval)
          handleAutoSubmit()
        } else {
          setTimeRemaining(remaining)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [attempt, isGraded, handleAutoSubmit])

  const handleAnswerChange = (questionId, optionId, textAnswer = null) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        selected_option_id: optionId,
        text_answer: textAnswer,
      }
    }))
  }

  const handleSaveAnswers = async () => {
    if (!attempt?.id) return

    try {
      const answersArray = Object.values(answers)
      if (answersArray.length === 0) {
        toast.error('No hay respuestas para guardar')
        return
      }

      await saveAnswersBatch(attempt.id, { answers: answersArray })
      toast.success('Respuestas guardadas exitosamente')
    } catch (error) {
      console.error('Error al guardar respuestas:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al guardar las respuestas'
      toast.error(errorMessage)
    }
  }

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  }

  const handleBack = () => {
    navigate('/seleccion-practicantes/examenes/asignados')
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

  if (!examen || accessError) {
    return (
      <div className={styles.container}>
        <EmptyState
          title={accessError ? 'No puedes acceder al examen' : 'Examen no encontrado'}
          message={
            accessError
              ? accessError
              : 'El examen que buscas no existe o fue eliminado.'
          }
          actionLabel="Volver"
          onAction={handleBack}
        />
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length
  const totalQuestions = preguntas.length
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft size={20} />
            Volver
          </button>
          <div>
            <h1 className={styles.title}>{examen.title}</h1>
            <p className={styles.subtitle}>
              {examen.description || 'Completa el examen respondiendo todas las preguntas'}
            </p>
          </div>
        </div>
        <div className={styles.headerInfo}>
          {timeRemaining !== null && (
            <div className={styles.timer}>
              <Clock size={18} />
              <span className={timeRemaining < 300000 ? styles.timerWarning : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <div className={styles.progress}>
            <span>{answeredCount} / {totalQuestions} respondidas</span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Información del examen */}
      <section className={styles.infoPanel}>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Calendar size={20} />
            </div>
            <div>
              <p>Disponible</p>
              <strong>
                {new Date(examen.start_date).toLocaleDateString()} -{' '}
                {new Date(examen.end_date).toLocaleDateString()}
              </strong>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Clock size={20} />
            </div>
            <div>
              <p>Tiempo límite</p>
              <strong>{examen.time_limit_minutes || 0} minutos</strong>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Layers size={20} />
            </div>
            <div>
              <p>Intentos realizados</p>
              <strong>
                {attemptsInfo.attemptsUsed} / {examen?.max_attempts || '∞'}
              </strong>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Target size={20} />
            </div>
            <div>
              <p>Nota mínima</p>
              <strong>{examen.passing_score ? `${examen.passing_score}/20` : 'No definida'}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Resultado */}
      {isGraded && result && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            {result.passed ? (
              <CheckCircle2 size={48} className={styles.resultIconSuccess} />
            ) : (
              <AlertCircle size={48} className={styles.resultIconError} />
            )}
            <h2 className={styles.resultTitle}>
              {result.passed ? '¡Examen Aprobado!' : 'Examen No Aprobado'}
            </h2>
          </div>
          <div className={styles.resultDetails}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Puntuación:</span>
              <span className={styles.resultValue}>{result.score?.toFixed(2)} / 20</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Porcentaje:</span>
              <span className={styles.resultValue}>{result.percentage?.toFixed(2)}%</span>
            </div>
            {examen.passing_score && (
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Nota Mínima:</span>
                <span className={styles.resultValue}>{examen.passing_score} / 20</span>
              </div>
            )}
          </div>
        </div>
      )}

      {isGraded && attemptsInfo.hasRemaining && (
        <div className={styles.retryContainer}>
          <div>
            <p className={styles.retryTitle}>¿Necesitas un nuevo intento?</p>
            <span className={styles.retryHint}>
              Te quedan{' '}
              {attemptsInfo.remaining === Number.POSITIVE_INFINITY
                ? 'intentos ilimitados'
                : `${attemptsInfo.remaining} intento(s)`}{' '}
              disponibles.
            </span>
          </div>
          <Button onClick={() => handleStartAttempt(examen)} variant="primary">
            Iniciar nuevo intento
          </Button>
        </div>
      )}

      {/* Resultados próximos */}
      {!isGraded && (
        <section className={styles.resultsPreview}>
          <div className={styles.resultsPreviewIcon}>
            <Award size={32} />
          </div>
          <div>
            <h3>Resultados disponibles cuando finalices</h3>
            <p>
              Revisa tu puntuación, porcentaje y promedio apenas envíes el examen. Aquí verás un
              resumen visual de tus intentos y logros.
            </p>
          </div>
        </section>
      )}

      {/* Content */}
      {!isGraded && (
        <div className={styles.content}>
          {preguntas.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>No hay preguntas en este examen</p>
            </div>
          ) : (
            <div className={styles.questionsList}>
              {preguntas
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((pregunta, index) => {
                  const questionAnswer = answers[pregunta.id]
                  const options = pregunta.options || pregunta.answer_options || []
                  
                  return (
                    <div key={pregunta.id} className={styles.questionCard}>
                      <div className={styles.questionHeader}>
                        <span className={styles.questionNumber}>Pregunta {index + 1}</span>
                        <span className={styles.questionPoints}>{pregunta.points || 1} puntos</span>
                      </div>
                      <h3 className={styles.questionText}>{pregunta.text}</h3>
                      
                      {pregunta.question_type === 'multiple_choice' && (
                        <div className={styles.optionsList}>
                          {options
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map((option) => (
                              <label
                                key={option.id}
                                className={`${styles.optionItem} ${
                                  questionAnswer?.selected_option_id === option.id ? styles.optionSelected : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${pregunta.id}`}
                                  value={option.id}
                                  checked={questionAnswer?.selected_option_id === option.id}
                                  onChange={() => handleAnswerChange(pregunta.id, option.id)}
                                  disabled={isGraded}
                                />
                                <span className={styles.optionText}>{option.text}</span>
                              </label>
                            ))}
                        </div>
                      )}

                      {pregunta.question_type === 'true_false' && (
                        <div className={styles.optionsList}>
                          <label
                            className={`${styles.optionItem} ${
                              questionAnswer?.selected_option_id === 'true' ? styles.optionSelected : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${pregunta.id}`}
                              value="true"
                              checked={questionAnswer?.selected_option_id === 'true'}
                              onChange={() => handleAnswerChange(pregunta.id, 'true')}
                              disabled={isGraded}
                            />
                            <span className={styles.optionText}>Verdadero</span>
                          </label>
                          <label
                            className={`${styles.optionItem} ${
                              questionAnswer?.selected_option_id === 'false' ? styles.optionSelected : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${pregunta.id}`}
                              value="false"
                              checked={questionAnswer?.selected_option_id === 'false'}
                              onChange={() => handleAnswerChange(pregunta.id, 'false')}
                              disabled={isGraded}
                            />
                            <span className={styles.optionText}>Falso</span>
                          </label>
                        </div>
                      )}

                      {pregunta.question_type === 'short_answer' && (
                        <textarea
                          className={styles.textAnswer}
                          value={questionAnswer?.text_answer || ''}
                          onChange={(e) => handleAnswerChange(pregunta.id, null, e.target.value)}
                          placeholder="Escribe tu respuesta aquí..."
                          disabled={isGraded}
                          rows={4}
                        />
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!isGraded && (
        <div className={styles.actions}>
          <Button
            onClick={handleSaveAnswers}
            variant="secondary"
            disabled={Object.keys(answers).length === 0 || isSubmitting}
          >
            Guardar Respuestas
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Finalizar Examen
          </Button>
        </div>
      )}
    </div>
  )
}

