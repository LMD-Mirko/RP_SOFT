import { FilePlus, ArrowRight, ClipboardCheck, XCircle, CheckCircle, Trash2, LogIn, LogOut, User, Clock } from 'lucide-react'
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
    case 'aceptacion':
      return CheckCircle
    case 'eliminacion':
      return Trash2
    case 'login':
      return LogIn
    case 'logout':
      return LogOut
    default:
      return FilePlus
  }
}

const getActivityTypeLabel = (type) => {
  switch (type) {
    case 'creacion':
      return 'Creación'
    case 'cambio':
      return 'Cambio'
    case 'evaluacion':
      return 'Evaluación'
    case 'rechazo':
      return 'Rechazo'
    case 'aceptacion':
      return 'Aceptación'
    case 'eliminacion':
      return 'Eliminación'
    case 'login':
      return 'Inicio de sesión'
    case 'logout':
      return 'Cierre de sesión'
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
    case 'aceptacion':
      return styles.typeAceptacion
    case 'eliminacion':
      return styles.typeEliminacion
    case 'login':
      return styles.typeLogin
    case 'logout':
      return styles.typeLogout
    default:
      return styles.typeDefault
  }
}

/**
 * Formatea un timestamp ISO 8601 a formato legible
 * @param {string} timestamp - Timestamp en formato ISO 8601
 * @returns {string} Timestamp formateado
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Fecha no disponible'
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return timestamp
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
                  <span>{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

