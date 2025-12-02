import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle, Save } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { EvaluacionTimer } from '../../components/EvaluacionTimer'
import { PreguntaCard } from '../../components/PreguntaCard'
import { useEvaluacionPostulante } from '../../hooks'
import styles from './EvaluacionPage.module.css'

/**
 * Página para completar una evaluación
 */
export function EvaluacionPage() {
  const { evaluationId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const jobPostingId = searchParams.get('convocatoria')

  const {
    loading,
    evaluacion,
    intento,
    respuestas,
    iniciarEvaluacionConvocatoria,
    iniciarIntento,
    cargarEvaluacion,
    cargarIntentoActivo,
    guardarRespuesta,
    guardarRespuestasBatch,
    calificarIntento,
    actualizarRespuestaLocal,
  } = useEvaluacionPostulante()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaveTime, setLastSaveTime] = useState(null)

  // Cargar evaluación e intento al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Si hay jobPostingId, iniciar evaluación desde convocatoria
        if (jobPostingId && !evaluationId) {
          const result = await iniciarEvaluacionConvocatoria(parseInt(jobPostingId))
          if (result.evaluation_id) {
            navigate(`/seleccion-practicantes/evaluaciones/${result.evaluation_id}/completar?convocatoria=${jobPostingId}`, { replace: true })
            return
          }
        }

        // Cargar evaluación
        if (evaluationId) {
          await cargarEvaluacion(evaluationId)

          // Intentar cargar intento activo
          try {
            await cargarIntentoActivo(evaluationId)
          } catch (error) {
            // Si no hay intento activo, crear uno nuevo
            if (error.response?.status === 404) {
              await iniciarIntento(evaluationId)
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar evaluación:', error)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationId, jobPostingId])

  // Auto-guardar respuestas cada 30 segundos
  useEffect(() => {
    if (!autoSaveEnabled || !intento?.id || Object.keys(respuestas).length === 0) {
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

          await guardarRespuestasBatch(intento.id, answers)
          setLastSaveTime(new Date())
        } catch (error) {
          console.error('Error en auto-guardado:', error)
        }
      }
    }, 30000) // 30 segundos

    return () => clearInterval(autoSaveInterval)
  }, [autoSaveEnabled, intento?.id, respuestas, guardarRespuestasBatch])

  const handleAnswerChange = useCallback(
    (questionId, answerOptionId, textAnswer) => {
      actualizarRespuestaLocal(questionId, answerOptionId, textAnswer)

      // Guardar inmediatamente si hay intento
      if (intento?.id && autoSaveEnabled) {
        guardarRespuesta(intento.id, questionId, answerOptionId, textAnswer).catch(
          (error) => {
            console.error('Error al guardar respuesta:', error)
          }
        )
      }
    },
    [intento?.id, autoSaveEnabled, actualizarRespuestaLocal, guardarRespuesta]
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
    if (!intento?.id) return

    setIsSubmitting(true)
    try {
      // Guardar todas las respuestas antes de calificar
      const answers = Object.entries(respuestas).map(([questionId, answer]) => ({
        question_id: questionId,
        answer_option_id: answer.answer_option_id,
        text_answer: answer.text_answer,
      }))

      if (answers.length > 0) {
        await guardarRespuestasBatch(intento.id, answers)
      }

      // Calificar
      const result = await calificarIntento(intento.id)

      // Redirigir a resultados
      navigate(`/seleccion-practicantes/evaluaciones/${evaluationId}/resultados`)
    } catch (error) {
      console.error('Error al enviar evaluación:', error)
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

  const preguntas = evaluacion?.questions || []
  const currentQuestion = preguntas[currentQuestionIndex]
  const totalQuestions = preguntas.length
  const answeredQuestions = Object.keys(respuestas).length

  if (loading && !evaluacion) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={16} />
        </div>
      </div>
    )
  }

  if (!evaluacion) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <AlertCircle size={48} />
          <h2>No se pudo cargar la evaluación</h2>
          <p>Por favor, intenta nuevamente más tarde.</p>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
          <div>
            <h1 className={styles.title}>{evaluacion.title}</h1>
            {evaluacion.description && (
              <p className={styles.description}>{evaluacion.description}</p>
            )}
          </div>
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

