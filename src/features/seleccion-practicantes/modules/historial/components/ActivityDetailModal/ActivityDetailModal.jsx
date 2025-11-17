import { FilePlus, ArrowRight, ClipboardCheck, XCircle, CheckCircle, Trash2, LogIn, LogOut, User, Clock, Calendar } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import clsx from 'clsx'
import styles from './ActivityDetailModal.module.css'

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return timestamp
  }
}

export function ActivityDetailModal({ isOpen, onClose, activity }) {
  if (!activity) return null

  const Icon = getActivityIcon(activity.type)
  const typeClass = getActivityTypeClass(activity.type)
  const typeLabel = getActivityTypeLabel(activity.type)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Actividad"
      size="md"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={clsx(styles.typeBadge, typeClass)}>
            <Icon size={20} />
            <span>{typeLabel}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Descripción</h4>
          <p className={styles.description}>{activity.description}</p>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <User size={18} />
            </div>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Actor</span>
              <p className={styles.detailValue}>{activity.actor}</p>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <Clock size={18} />
            </div>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Fecha y Hora</span>
              <p className={styles.detailValue}>{formatTimestamp(activity.timestamp)}</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.closeButton}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}


