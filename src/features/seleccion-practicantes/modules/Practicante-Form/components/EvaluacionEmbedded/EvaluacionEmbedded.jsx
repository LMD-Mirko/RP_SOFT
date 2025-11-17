import { useState, useEffect, useCallback } from 'react'
import { Clock, CheckCircle2, AlertCircle, Save } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { EvaluacionTimer } from '../../../evaluaciones-postulante/components/EvaluacionTimer'
import { PreguntaCard } from '../../../evaluaciones-postulante/components/PreguntaCard'
import * as evaluacionService from '../../../evaluaciones-postulante/services'
import { useToast } from '@shared/components/Toast'
import styles from './EvaluacionEmbedded.module.css'

/**
 * Componente embebido para completar una evaluación dentro del flujo de postulación
 * Mantiene el flujo lineal sin salir de la página
 */
export function EvaluacionEmbedded({ 
  evaluationId, 
  convocatoriaId, 
  onComplete, 
  onSkip,
  evaluationType = 'technical' 
}) {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [evaluacion, setEvaluacion] = useState(null)
  const [intento, setIntento] = useState(null)
  const [respuestas, setRespuestas] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState(null)

  // Cargar evaluación e intento
  useEffect(() => {
    const loadData = async () => {
      if (!evaluationId && !convocatoriaId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Si hay convocatoriaId pero no evaluationId, iniciar evaluación
        if (convocatoriaId && !evaluationId) {
          const startResult = await evaluacionService.iniciarEvaluacionConvocatoria(parseInt(convocatoriaId))
          if (startResult.evaluation_id) {
            // Cargar la evaluación
            const evalData = await evaluacionService.obtenerEvaluacionView(startResult.evaluation_id)
            setEvaluacion(evalData)
            
            // Intentar cargar intento activo
            try {
              const attemptResult = await evaluacionService.obtenerIntentoActivo(startResult.evaluation_id)
              setIntento(attemptResult.attempt || attemptResult)
              
              // Cargar respuestas guardadas
              if (attemptResult.answers && Array.isArray(attemptResult.answers)) {
                const respuestasMap = {}
                attemptResult.answers.forEach((answer) => {
                  respuestasMap[answer.question_id] = {
                    answer_option_id: answer.answer_option_id,
                    text_answer: answer.text_answer,
                  }
                })
                setRespuestas(respuestasMap)
              }
            } catch (error) {
              // Si no hay intento activo, crear uno nuevo
              if (error.response?.status === 404) {
                const newAttempt = await evaluacionService.iniciarIntento(startResult.evaluation_id)
                setIntento(newAttempt)
              }
            }
          }
        } else if (evaluationId) {
          // Cargar evaluación directamente
          const evalData = await evaluacionService.obtenerEvaluacionView(evaluationId)
          setEvaluacion(evalData)
          
          // Intentar cargar intento activo
          try {
            const attemptResult = await evaluacionService.obtenerIntentoActivo(evaluationId)
            setIntento(attemptResult.attempt || attemptResult)
            
            // Cargar respuestas guardadas
            if (attemptResult.answers && Array.isArray(attemptResult.answers)) {
              const respuestasMap = {}
              attemptResult.answers.forEach((answer) => {
                respuestasMap[answer.question_id] = {
                  answer_option_id: answer.answer_option_id,
                  text_answer: answer.text_answer,
                }
              })
              setRespuestas(respuestasMap)
            }
          } catch (error) {
            // Si no hay intento activo, crear uno nuevo
            if (error.response?.status === 404) {
              const newAttempt = await evaluacionService.iniciarIntento(evaluationId)
              setIntento(newAttempt)
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar evaluación:', error)
        toast.error('Error al cargar la evaluación')
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationId, convocatoriaId])

  // Auto-guardar respuestas cada 30 segundos
  useEffect(() => {
    if (!intento?.id || Object.keys(respuestas).length === 0) {
      return
    }

    const autoSaveInterval = setInterval(async () => {
      if (intento?.id && Object.keys(respuestas).length > 0) {
        try {
          const answers = Object.entries(respuestas).map(([questionId, answer]) => ({
            question_id: questionId,
            answer_option_id: answer.answer_option_id,
            text_answer: answer.text_answer,
          }))

          await evaluacionService.guardarRespuestasBatch(intento.id, { answers })
          setLastSaveTime(new Date())
        } catch (error) {
          console.error('Error en auto-guardado:', error)
        }
      }
    }, 30000) // 30 segundos

    return () => clearInterval(autoSaveInterval)
  }, [intento?.id, respuestas])

  const handleAnswerChange = useCallback(
    (questionId, answerOptionId, textAnswer) => {
      setRespuestas((prev) => ({
        ...prev,
        [questionId]: {
          answer_option_id: answerOptionId,
          text_answer: textAnswer,
        },
      }))

      // Guardar inmediatamente si hay intento
      if (intento?.id) {
        evaluacionService.guardarRespuesta(intento.id, {
          question_id: questionId,
          answer_option_id: answerOptionId,
          text_answer: textAnswer,
        }).catch((error) => {
          console.error('Error al guardar respuesta:', error)
        })
      }
    },
    [intento?.id]
  )

  const handleNext = () => {
    if (currentQuestionIndex < (evaluacion?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = async () => {
    if (!intento?.id) {
      if (onSkip) onSkip()
      return
    }

    setIsSubmitting(true)
    try {
      // Guardar todas las respuestas antes de calificar
      const answers = Object.entries(respuestas).map(([questionId, answer]) => ({
        question_id: questionId,
        answer_option_id: answer.answer_option_id,
        text_answer: answer.text_answer,
      }))

      if (answers.length > 0) {
        await evaluacionService.guardarRespuestasBatch(intento.id, { answers })
      }

      // Calificar
      const result = await evaluacionService.calificarIntento(intento.id)
      setIntento(result.attempt || result)

      toast.success('Evaluación completada exitosamente')
      
      // Llamar callback de completado
      if (onComplete) {
        onComplete(result)
      }
    } catch (error) {
      console.error('Error al enviar evaluación:', error)
      toast.error('Error al completar la evaluación')
    } finally {
      setIsSubmitting(false)
      setShowConfirmModal(false)
    }
  }

  const handleExpire = () => {
    // Cuando expire el tiempo, guardar y calificar automáticamente
    if (intento?.id) {
      handleSubmit()
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    )
  }

  if (!evaluacion && !convocatoriaId) {
    return (
      <div className={styles.noEvaluation}>
        <AlertCircle size={48} />
        <h3>No hay evaluación disponible</h3>
        <p>No se encontró una evaluación para esta convocatoria.</p>
        {onSkip && (
          <Button variant="primary" onClick={onSkip}>
            Continuar sin evaluación
          </Button>
        )}
      </div>
    )
  }

  if (!evaluacion) {
    return (
      <div className={styles.loading}>
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
    )
  }

  const preguntas = evaluacion.questions || []
  const currentQuestion = preguntas[currentQuestionIndex]
  const totalQuestions = preguntas.length
  const answeredQuestions = Object.keys(respuestas).length

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{evaluacion.title}</h3>
          {evaluacion.description && (
            <p className={styles.description}>{evaluacion.description}</p>
          )}
        </div>
        {intento?.expires_at && (
          <EvaluacionTimer
            expiresAt={intento.expires_at}
            onExpire={handleExpire}
            timeLimitMinutes={intento.time_limit_minutes}
          />
        )}
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span>
            Pregunta {currentQuestionIndex + 1} de {totalQuestions}
          </span>
          <span>
            {answeredQuestions} de {totalQuestions} respondidas
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Questions Navigation */}
      {totalQuestions > 1 && (
        <div className={styles.questionsNav}>
          {preguntas.map((pregunta, index) => {
            const isAnswered = respuestas[pregunta.id] !== undefined
            const isCurrent = index === currentQuestionIndex

            return (
              <button
                key={pregunta.id}
                className={`${styles.questionNavItem} ${
                  isCurrent ? styles.questionNavItemActive : ''
                } ${isAnswered ? styles.questionNavItemAnswered : ''}`}
                onClick={() => handleGoToQuestion(index)}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      )}

      {/* Current Question */}
      {currentQuestion && (
        <div className={styles.questionSection}>
          <PreguntaCard
            pregunta={currentQuestion}
            respuestaActual={respuestas[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={styles.actions}>
        <div className={styles.actionsLeft}>
          {lastSaveTime && (
            <span className={styles.saveIndicator}>
              <Save size={14} />
              Guardado: {lastSaveTime.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className={styles.actionsRight}>
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            Anterior
          </Button>
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting || answeredQuestions === 0}
              loading={isSubmitting}
            >
              <CheckCircle2 size={18} />
              Finalizar Evaluación
            </Button>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        title="Finalizar Evaluación"
        message={`¿Estás seguro de que deseas finalizar la evaluación? Has respondido ${answeredQuestions} de ${totalQuestions} preguntas.`}
        confirmText="Sí, Finalizar"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  )
}

