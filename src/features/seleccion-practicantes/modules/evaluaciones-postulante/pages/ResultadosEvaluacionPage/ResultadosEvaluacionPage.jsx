import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Award, TrendingUp } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { PreguntaCard } from '../../components/PreguntaCard'
import { useEvaluacionPostulante } from '../../hooks'
import styles from './ResultadosEvaluacionPage.module.css'

/**
 * Página para ver los resultados de una evaluación completada
 */
export function ResultadosEvaluacionPage() {
  const { evaluationId } = useParams()
  const navigate = useNavigate()
  const { loading, evaluacion, intento, cargarEvaluacion, cargarIntentoActivo } =
    useEvaluacionPostulante()

  const [respuestasMap, setRespuestasMap] = useState({})

  useEffect(() => {
    const loadData = async () => {
      try {
        if (evaluationId) {
          await cargarEvaluacion(evaluationId)
          const result = await cargarIntentoActivo(evaluationId)

          // Mapear respuestas
          if (result.answers && Array.isArray(result.answers)) {
            const map = {}
            result.answers.forEach((answer) => {
              map[answer.question_id] = {
                answer_option_id: answer.answer_option_id,
                text_answer: answer.text_answer,
                is_correct: answer.is_correct,
                points_earned: answer.points_earned,
              }
            })
            setRespuestasMap(map)
          }
        }
      } catch (error) {
        console.error('Error al cargar resultados:', error)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationId])

  if (loading && !intento) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="80%" height={24} />
        </div>
      </div>
    )
  }

  if (!intento || !evaluacion) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <XCircle size={48} />
          <h2>No se encontraron resultados</h2>
          <p>Esta evaluación aún no ha sido completada o calificada.</p>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    )
  }

  const score = intento.score || 0
  const totalPoints = intento.total_points || evaluacion.total_points || 0
  const percentage = intento.percentage || (totalPoints > 0 ? (score / totalPoints) * 100 : 0)
  const passed = intento.passed !== undefined ? intento.passed : percentage >= (evaluacion.passing_score || 0)
  const passingScore = evaluacion.passing_score || 0

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button
          variant="secondary"
          onClick={() => navigate('/seleccion-practicantes/evaluaciones/mis-evaluaciones')}
          className={styles.backButton}
        >
          <ArrowLeft size={18} />
          Volver a Mis Evaluaciones
        </Button>
        <div>
          <h1 className={styles.title}>Resultados de la Evaluación</h1>
          <p className={styles.subtitle}>{evaluacion.title}</p>
        </div>
      </div>

      {/* Score Card */}
      <div className={`${styles.scoreCard} ${passed ? styles.scoreCardPassed : styles.scoreCardFailed}`}>
        <div className={styles.scoreIcon}>
          {passed ? (
            <CheckCircle2 size={64} className={styles.iconPassed} />
          ) : (
            <XCircle size={64} className={styles.iconFailed} />
          )}
        </div>
        <div className={styles.scoreContent}>
          <div className={styles.scoreMain}>
            <span className={styles.scoreLabel}>Puntaje</span>
            <span className={styles.scoreValue}>
              {score.toFixed(1)} / {totalPoints.toFixed(1)}
            </span>
          </div>
          <div className={styles.scorePercentage}>
            <TrendingUp size={20} />
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <div className={styles.scoreStatus}>
            {passed ? (
              <div className={styles.statusPassed}>
                <Award size={20} />
                <span>¡Aprobado!</span>
              </div>
            ) : (
              <div className={styles.statusFailed}>
                <span>No aprobado</span>
                <span className={styles.passingScore}>
                  (Puntaje mínimo: {passingScore}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evaluation Info */}
      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Fecha de inicio:</span>
          <span className={styles.infoValue}>
            {intento.started_at
              ? new Date(intento.started_at).toLocaleString('es-ES')
              : '-'}
          </span>
        </div>
        {intento.submitted_at && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de envío:</span>
            <span className={styles.infoValue}>
              {new Date(intento.submitted_at).toLocaleString('es-ES')}
            </span>
          </div>
        )}
        {intento.graded_at && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de calificación:</span>
            <span className={styles.infoValue}>
              {new Date(intento.graded_at).toLocaleString('es-ES')}
            </span>
          </div>
        )}
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Estado:</span>
          <span className={`${styles.infoValue} ${styles[`status${intento.status?.charAt(0).toUpperCase() + intento.status?.slice(1).replace(/_([a-z])/g, (g) => g[1].toUpperCase())}`]}`}>
            {intento.status === 'graded' ? 'Calificado' : 
             intento.status === 'submitted' ? 'Enviado' :
             intento.status === 'expired' ? 'Expirado' : 
             intento.status || '-'}
          </span>
        </div>
      </div>

      {/* Questions Review */}
      <div className={styles.questionsSection}>
        <h2 className={styles.sectionTitle}>Revisión de Respuestas</h2>
        {evaluacion.questions && evaluacion.questions.length > 0 ? (
          <div className={styles.questionsList}>
            {evaluacion.questions.map((pregunta, index) => (
              <PreguntaCard
                key={pregunta.id}
                pregunta={pregunta}
                respuestaActual={respuestasMap[pregunta.id]}
                onAnswerChange={() => {}} // No permitir cambios en resultados
                showResults={true}
                disabled={true}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No hay preguntas en esta evaluación.</p>
          </div>
        )}
      </div>
    </div>
  )
}

