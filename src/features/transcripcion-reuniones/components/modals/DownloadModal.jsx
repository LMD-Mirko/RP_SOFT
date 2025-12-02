import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import { Download } from 'lucide-react'
import styles from './DownloadModal.module.css'

export function DownloadModal({ isOpen, onClose, onConfirm }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onConfirm?.()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Descarga" size="md">
      <div className={styles.content} onKeyDown={handleKeyDown}>
        <p className={styles.message}>¿Estás seguro de que deseas descargar este archivo?</p>
        <div className={styles.actions}>
          <Button size="lg" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button size="lg" variant="primary" icon={Download} onClick={onConfirm}>Descargar</Button>
        </div>
      </div>
    </Modal>
  )
}