import { Button } from '@shared/components/Button'
import { Brain, AlertCircle } from 'lucide-react'
import { EvaluacionEmbedded } from '../EvaluacionEmbedded'
import styles from './PsicologiaStep.module.css'

/**
 * Paso de Evaluación Psicológica
 * Usa EvaluacionEmbedded para mostrar la evaluación directamente en el flujo lineal
 */
export function PsicologiaStep({ evaluationId, convocatoriaId, onNext, onBack, onEvaluationComplete, evaluationStatus }) {
  const handleEvaluationComplete = (result) => {
    // Cuando se completa la evaluación, continuar al siguiente paso
    if (onEvaluationComplete) {
      onEvaluationComplete()
    }
    onNext({ 
      evaluacionPsicologicaCompletada: true,
      evaluacionResultado: result 
    })
  }

  const handleSkip = () => {
    // Permitir saltar si no hay evaluación disponible
    onNext({ evaluacionPsicologicaCompletada: false })
  }

  // Si la evaluación ya está completada y aprobada, mostrar mensaje de éxito
  if (evaluationStatus?.status === 'completed' && evaluationStatus?.passed) {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.stepCard}>
          <div className={styles.stepHeader}>
            <div className={styles.iconContainer}>
              <Brain size={48} className={styles.icon} />
            </div>
            <h2 className={styles.stepTitle}>Evaluación Psicológica</h2>
            <p className={styles.stepSubtitle}>
              Ya completaste esta evaluación exitosamente
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className={styles.buttonSecondary}
            >
              Atrás
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => onNext({ evaluacionPsicologicaCompletada: true })}
              className={styles.buttonPrimary}
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepCard}>
        <div className={styles.stepHeader}>
          <div className={styles.iconContainer}>
            <Brain size={48} className={styles.icon} />
          </div>
          <h2 className={styles.stepTitle}>Evaluación Psicológica</h2>
          <p className={styles.stepSubtitle}>
            Completa la evaluación psicológica para continuar
          </p>
        </div>

        <div className={styles.content}>
          {evaluationId || convocatoriaId ? (
            <EvaluacionEmbedded
              evaluationId={evaluationId}
              convocatoriaId={convocatoriaId}
              evaluationType="psychological"
              onComplete={handleEvaluationComplete}
              onSkip={handleSkip}
            />
          ) : (
            <>
              <div className={styles.warningBox}>
                <AlertCircle size={16} />
                <span>
                  No hay evaluación psicológica disponible para esta convocatoria.
                  Puedes continuar con el siguiente paso.
                </span>
              </div>
              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onBack}
                  className={styles.buttonSecondary}
                >
                  Atrás
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSkip}
                  className={styles.buttonPrimary}
                >
                  Continuar sin Evaluación
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}