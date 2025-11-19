import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getExamById,
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

  useEffect(() => {
    loadExam()
  }, [examId])

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
  }, [attempt, isGraded])

  const loadExam = async () => {
    if (!examId) return

    try {
      setLoading(true)
      const examData = await getExamById(examId)
      setExamen(examData)
      setPreguntas(examData.questions || [])
      
      // Iniciar intento
      await handleStartAttempt()
    } catch (error) {
      console.error('Error al cargar examen:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al cargar el examen'
      toast.error(errorMessage)

      if (error.response?.status === 404) {
        setTimeout(() => {
          navigate('/seleccion-practicantes')
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStartAttempt = async () => {
    try {
      const attemptData = await startExamAttempt(examId)
      setAttempt(attemptData)
      
      if (attemptData.expires_at) {
        const now = new Date().getTime()
        const expires = new Date(attemptData.expires_at).getTime()
        setTimeRemaining(Math.max(0, expires - now))
      }
    } catch (error) {
      console.error('Error al iniciar intento:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al iniciar el examen'
      toast.error(errorMessage)
    }
  }

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

  const handleAutoSubmit = async () => {
    if (isSubmitting || isGraded) return
    
    toast.error('El tiempo se ha agotado. Enviando examen automáticamente...')
    await handleSubmit()
  }

  const handleSubmit = async () => {
    if (!attempt?.id || isSubmitting || isGraded) return

    try {
      setIsSubmitting(true)
      
      // Guardar respuestas antes de calificar
      const answersArray = Object.values(answers)
      if (answersArray.length > 0) {
        await saveAnswersBatch(attempt.id, { answers: answersArray })
      }

      // Calificar
      const gradeResult = await gradeAttempt(attempt.id)
      setResult(gradeResult)
      setIsGraded(true)
      
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
    navigate('/seleccion-practicantes')
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

  if (!examen) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Examen no encontrado"
          message="El examen que buscas no existe o fue eliminado."
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

