import { useSearchParams } from 'react-router-dom'
import { Button } from '@shared/components/Button'
import { Code, AlertCircle } from 'lucide-react'
import { EvaluacionEmbedded } from '../EvaluacionEmbedded'
import styles from './TecnicaStep.module.css'

/**
 * Paso de Evaluación Técnica
 * Muestra la evaluación directamente en el flujo lineal sin salir de la página
 */
export function TecnicaStep({ data, onNext, onBack, convocatoriaId }) {
  const [searchParams] = useSearchParams()
  const jobPostingId = searchParams.get('convocatoria') || convocatoriaId

  const handleEvaluationComplete = (result) => {
    // Cuando se completa la evaluación, continuar al siguiente paso
    onNext({ 
      evaluacionTecnicaCompletada: true,
      evaluacionResultado: result 
    })
  }

  const handleSkip = () => {
    // Permitir saltar si no hay evaluación disponible
    onNext({ evaluacionTecnicaCompletada: false })
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepCard}>
        <div className={styles.stepHeader}>
          <div className={styles.iconContainer}>
            <Code size={48} className={styles.icon} />
          </div>
          <h2 className={styles.stepTitle}>Evaluación Técnica</h2>
          <p className={styles.stepSubtitle}>
            Completa la evaluación técnica para demostrar tus conocimientos
          </p>
        </div>

        <div className={styles.content}>
          {jobPostingId ? (
            <EvaluacionEmbedded
              convocatoriaId={jobPostingId}
              evaluationType="technical"
              onComplete={handleEvaluationComplete}
              onSkip={handleSkip}
            />
          ) : (
            <>
              <div className={styles.warningBox}>
                <AlertCircle size={16} />
                <span>
                  No hay evaluación técnica disponible para esta convocatoria.
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
