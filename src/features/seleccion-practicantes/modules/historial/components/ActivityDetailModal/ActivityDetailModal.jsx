import { FilePlus, ArrowRight, ClipboardCheck, XCircle, User, Clock, Calendar } from 'lucide-react'
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
              <p className={styles.detailValue}>{activity.timestamp}</p>
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


