import { FileText, HelpCircle, Brain, Target, ArrowRight } from 'lucide-react'
import styles from './EvaluacionCard.module.css'
import clsx from 'clsx'

const EVALUATION_CONFIG = {
  profile: {
    icon: FileText,
    title: 'Encuesta de Perfil',
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  technical: {
    icon: HelpCircle,
    title: 'Evaluación Técnica',
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  psychological: {
    icon: Brain,
    title: 'Evaluación Psicológica',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
  motivation: {
    icon: Target,
    title: 'Evaluación de Motivación',
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
}

export function EvaluacionCard({ evaluationType, evaluation, onManage, index = 0 }) {
  const config = EVALUATION_CONFIG[evaluationType] || EVALUATION_CONFIG.profile
  const Icon = config.icon
  const exists = evaluation !== null && evaluation !== undefined

  return (
    <div
      className={clsx(styles.card, !exists && styles.cardDisabled)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.iconContainer} style={{ backgroundColor: config.bgColor }}>
        <Icon size={32} color={config.color} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{config.title}</h3>
        {exists && evaluation?.evaluation ? (
          <>
            {evaluation.evaluation.description && (
              <p className={styles.description}>{evaluation.evaluation.description}</p>
            )}
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Estado</span>
                <span
                  className={clsx(
                    styles.statValue,
                    evaluation.evaluation.is_active ? styles.active : styles.inactive
                  )}
                >
                  {evaluation.evaluation.is_active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              {evaluation.evaluation.passing_score && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Puntaje Mínimo</span>
                  <span className={styles.statValue}>{evaluation.evaluation.passing_score}%</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className={styles.emptyText}>Esta evaluación aún no ha sido configurada</p>
        )}
      </div>

      <div className={styles.footer}>
        <button
          onClick={() => onManage(evaluationType)}
          className={styles.manageButton}
          disabled={!exists}
        >
          Gestionar Preguntas
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

