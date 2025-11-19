import { useState, useEffect, useCallback } from 'react'
import { Clock, CheckCircle2, AlertCircle, Save, FileText, CheckCircle, Info } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@shared/components/Button'
import { Modal } from '@shared/components/Modal'
import confirmStyles from '@shared/components/ConfirmModal/ConfirmModal.module.css'
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
            // La API devuelve { evaluation: {...}, questions: [...] }
            setEvaluacion(evalData.evaluation ? evalData : { evaluation: evalData, questions: evalData.questions || [] })
            
            // Intentar cargar intento activo
            try {
              const attemptResult = await evaluacionService.obtenerIntentoActivo(startResult.evaluation_id)
              setIntento(attemptResult.attempt || attemptResult)
              
              // Cargar respuestas guardadas
              if (attemptResult.answers && Array.isArray(attemptResult.answers)) {
                const respuestasMap = {}
                attemptResult.answers.forEach((answer) => {
                  // Los IDs pueden venir como string o número, mantener como string (UUID)
                  const questionId = String(answer.question_id)
                  respuestasMap[questionId] = {
                    selected_option_id: String(answer.selected_option_id || answer.answer_option_id || ''),
                    text_answer: answer.text_answer || '',
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
          // La API devuelve { evaluation: {...}, questions: [...] }
          setEvaluacion(evalData.evaluation ? evalData : { evaluation: evalData, questions: evalData.questions || [] })
          
          // Intentar cargar intento activo
          try {
            const attemptResult = await evaluacionService.obtenerIntentoActivo(evaluationId)
            setIntento(attemptResult.attempt || attemptResult)
            
            // Cargar respuestas guardadas
            if (attemptResult.answers && Array.isArray(attemptResult.answers)) {
              const respuestasMap = {}
              attemptResult.answers.forEach((answer) => {
                // Los IDs pueden venir como string o número, mantener como string
                const questionId = String(answer.question_id)
                respuestasMap[questionId] = {
                  selected_option_id: String(answer.selected_option_id || answer.answer_option_id || ''),
                  text_answer: answer.text_answer || '',
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
          question_id: questionId, // Mantener como string (UUID)
          selected_option_id: answer.selected_option_id, // Mantener como string (UUID)
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
    (questionId, selectedOptionId, textAnswer) => {
      setRespuestas((prev) => ({
        ...prev,
        [questionId]: {
          selected_option_id: selectedOptionId,
          text_answer: textAnswer,
        },
      }))

      // Guardar inmediatamente si hay intento
      if (intento?.id && selectedOptionId) {
        evaluacionService.guardarRespuesta(intento.id, {
          question_id: questionId, // Mantener como string (UUID)
          selected_option_id: selectedOptionId, // Mantener como string (UUID)
        }).catch((error) => {
          console.error('Error al guardar respuesta:', error)
        })
      }
    },
    [intento?.id]
  )

  // Ya no necesitamos navegación entre preguntas, todas se muestran a la vez

  const handleSubmit = async () => {
    if (!intento?.id) {
      if (onSkip) onSkip()
      return
    }

    setIsSubmitting(true)
    try {
      // Guardar todas las respuestas antes de calificar
      const answers = Object.entries(respuestas)
        .filter(([_, answer]) => answer.selected_option_id) // Solo incluir respuestas con opción seleccionada
        .map(([questionId, answer]) => ({
          question_id: questionId, // Mantener como string (UUID)
          selected_option_id: answer.selected_option_id, // Mantener como string (UUID)
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

  const preguntas = evaluacion.questions || evaluacion.evaluation?.questions || []
  const evaluationData = evaluacion.evaluation || evaluacion
  const totalQuestions = preguntas.length
  const answeredQuestions = Object.keys(respuestas).length

  // Debug: Verificar estructura de datos
  if (preguntas.length > 0 && process.env.NODE_ENV === 'development') {
    console.log('[EvaluacionEmbedded] Preguntas recibidas:', {
      total: preguntas.length,
      primera_pregunta: {
        id: preguntas[0].id,
        text: preguntas[0].text,
        options: preguntas[0].options || preguntas[0].answer_options,
        options_count: (preguntas[0].options || preguntas[0].answer_options || []).length
      }
    })
  }

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.progressInfoItem}>
            <FileText size={16} />
            Total: {totalQuestions} preguntas
          </span>
          <span className={styles.progressInfoItem}>
            <CheckCircle size={16} />
            {answeredQuestions} de {totalQuestions} respondidas
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(answeredQuestions / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* All Questions - Estilo Blackboard */}
      {preguntas.length > 0 ? (
        <div className={styles.allQuestionsContainer}>
          {preguntas.map((pregunta, index) => {
            // Asegurar que el ID de la pregunta se use como string para buscar respuestas
            const questionIdString = String(pregunta.id)
            return (
              <div key={pregunta.id} className={styles.questionWrapper}>
                <PreguntaCard
                  pregunta={pregunta}
                  respuestaActual={respuestas[questionIdString]}
                  onAnswerChange={handleAnswerChange}
                  disabled={isSubmitting}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.noEvaluation}>
          <AlertCircle size={48} />
          <h3>No hay preguntas disponibles</h3>
          <p>Esta evaluación no tiene preguntas configuradas.</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={styles.actions}>
        <div className={styles.actionsLeft}>
          {lastSaveTime && (
            <span className={styles.saveIndicator}>
              <Save size={16} />
              <span>Guardado: {lastSaveTime.toLocaleTimeString()}</span>
            </span>
          )}
        </div>
        <div className={styles.actionsRight}>
          <Button
            variant="primary"
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting || answeredQuestions === 0 || answeredQuestions < totalQuestions}
            loading={isSubmitting}
            className={styles.finalizeButton}
          >
            <CheckCircle2 size={20} />
            <span>Finalizar Evaluación</span>
          </Button>
        </div>
      </div>

      {/* Confirm Modal (local) - centrado para no tapar el header */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onCloseComplete={null}
        size="sm"
        closeOnOverlayClick={!isSubmitting}
        showCloseButton={false}
        title={null}
        centered={true}
      >
        <div className={confirmStyles.content}>
          <div className={clsx(confirmStyles.iconContainer, confirmStyles[`icon_${answeredQuestions < totalQuestions ? 'warning' : 'info'}`])}>
            <div className={confirmStyles.iconWrapper}>
              {answeredQuestions < totalQuestions ? <AlertCircle size={24} /> : <Info size={24} />}
            </div>
          </div>

          <div className={confirmStyles.textContainer}>
            <h3 className={confirmStyles.title}>Finalizar Evaluación</h3>
            <p className={confirmStyles.message}>{`¿Estás seguro de que deseas finalizar la evaluación? Has respondido ${answeredQuestions} de ${totalQuestions} preguntas.${answeredQuestions < totalQuestions ? ' Asegúrate de responder todas las preguntas antes de finalizar.' : ''}`}</p>
          </div>

          <div className={confirmStyles.actions}>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              disabled={isSubmitting}
              fullWidth
              className={confirmStyles.cancelButton}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              fullWidth
              className={clsx(confirmStyles.confirmButton, confirmStyles[`confirmButton_${answeredQuestions < totalQuestions ? 'warning' : 'info'}`])}
            >
              Sí, Finalizar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

