import { FilePlus, ArrowRight, ClipboardCheck, XCircle, User, Clock } from 'lucide-react'
import clsx from 'clsx'
import styles from './ActivityList.module.css'

const getActivityIcon = (type) => {
  switch (type) {
    case 'creacion':
      return FilePlus
    case 'cambio':
      return ArrowRight
    case 'evaluacion':
      return ClipboardCheck
    case 'rechazo':
      return XCircle
    default:
      return FilePlus
  }
}

const getActivityTypeLabel = (type) => {
  switch (type) {
    case 'creacion':
      return 'Creación de Convocatoria'
    case 'cambio':
      return 'Cambio etapa'
    case 'evaluacion':
      return 'Evaluación registrada'
    case 'rechazo':
      return 'Postulante rechazado'
    default:
      return 'Actividad'
  }
}

const getActivityTypeClass = (type) => {
  switch (type) {
    case 'creacion':
      return styles.typeCreacion
    case 'cambio':
      return styles.typeCambio
    case 'evaluacion':
      return styles.typeEvaluacion
    case 'rechazo':
      return styles.typeRechazo
    default:
      return styles.typeDefault
  }
}

export function ActivityList({ activities, onActivityClick }) {
  if (!activities || activities.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No hay actividades registradas</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type)
        const typeClass = getActivityTypeClass(activity.type)
        const typeLabel = getActivityTypeLabel(activity.type)

        return (
          <div 
            key={activity.id || index} 
            className={styles.activityItem}
            onClick={() => onActivityClick && onActivityClick(activity)}
          >
            <div className={styles.activityMain}>
              <div className={styles.activityType}>
                <div className={clsx(styles.typeBadge, typeClass)}>
                  <Icon size={16} />
                  <span>{typeLabel}</span>
                </div>
                <p className={styles.activityDescription}>{activity.description}</p>
              </div>

              <div className={styles.activityMeta}>
                <div className={styles.actor}>
                  <User size={16} />
                  <span>{activity.actor}</span>
                </div>
                <div className={styles.timestamp}>
                  <Clock size={16} />
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

