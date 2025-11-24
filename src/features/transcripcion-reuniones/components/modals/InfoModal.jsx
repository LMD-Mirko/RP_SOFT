import { Modal } from '@shared/components/Modal'
import styles from './InfoModal.module.css'
import { X } from 'lucide-react'

export function InfoModal({ isOpen, onClose, item }) {
  if (!item) return null
  const sizeText = `${item.sizeKB?.toFixed?.(4) ?? '—'} KB`
  const formatText = item.type ? `Archivo.${item.type}` : '—'
  const dateText = item.date || '—'
  const durationText = item.duration || '—'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Información" showCloseButton size="lg" centered>
      <div className={styles.container}>

        <div className={styles.field}>
          <div className={styles.label}>Nombre completo:</div>
          <input readOnly value={item.name} className={styles.input} />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Formato:</div>
          <input readOnly value={formatText} className={`${styles.input} ${styles.inputShort}`} />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Fecha subida:</div>
          <input readOnly value={dateText} className={`${styles.input} ${styles.inputShort}`} />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Duración:</div>
          <input readOnly value={durationText} className={`${styles.input} ${styles.inputShort}`} />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Tamaño</div>
          <input readOnly value={sizeText} className={`${styles.input} ${styles.inputShort}`} />
        </div>
      </div>
    </Modal>
  )
}