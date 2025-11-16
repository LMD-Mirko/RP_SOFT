import { GraduationCap, CheckCircle, XCircle } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import styles from './SpecialtyDetailModal.module.css'
import clsx from 'clsx'

export function SpecialtyDetailModal({ isOpen, onClose, specialty }) {
  if (!specialty) return null

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Especialidad"
      size="md"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <GraduationCap size={32} />
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.name}>{specialty.name}</h3>
            <span className={clsx(styles.badge, specialty.is_active ? styles.badgeActive : styles.badgeInactive)}>
              {specialty.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información General</h4>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Descripción:</span>
              <span className={styles.detailValue}>{specialty.description || 'Sin descripción'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Estado:</span>
              <span className={styles.detailValue}>
                {specialty.is_active ? (
                  <span className={styles.statusActive}>
                    <CheckCircle size={16} />
                    Activo
                  </span>
                ) : (
                  <span className={styles.statusInactive}>
                    <XCircle size={16} />
                    Inactivo
                  </span>
                )}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Fecha de Creación:</span>
              <span className={styles.detailValue}>{formatDate(specialty.created_at)}</span>
            </div>
            {specialty.updated_at && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Última Actualización:</span>
                <span className={styles.detailValue}>{formatDate(specialty.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

