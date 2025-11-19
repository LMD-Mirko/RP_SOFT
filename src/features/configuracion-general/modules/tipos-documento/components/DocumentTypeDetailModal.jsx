import { FileText, CheckCircle, XCircle } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import styles from './DocumentTypeDetailModal.module.css'
import clsx from 'clsx'

export function DocumentTypeDetailModal({ isOpen, onClose, documentType }) {
  if (!documentType) return null

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
      title="Detalles del Tipo de Documento"
      size="md"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <FileText size={32} />
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.name}>{documentType.name}</h3>
            <span className={clsx(styles.badge, documentType.is_active ? styles.badgeActive : styles.badgeInactive)}>
              {documentType.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información General</h4>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Descripción:</span>
              <span className={styles.detailValue}>{documentType.description || 'Sin descripción'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Estado:</span>
              <span className={styles.detailValue}>
                {documentType.is_active ? (
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
              <span className={styles.detailValue}>{formatDate(documentType.created_at)}</span>
            </div>
            {documentType.updated_at && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Última Actualización:</span>
                <span className={styles.detailValue}>{formatDate(documentType.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

