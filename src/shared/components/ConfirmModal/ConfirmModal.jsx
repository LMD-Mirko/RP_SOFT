import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { Modal } from '../Modal'
import { Button } from '../Button'
import styles from './ConfirmModal.module.css'
import clsx from 'clsx'

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  isLoading = false,
}) {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={24} />
      case 'error':
        return <AlertCircle size={24} />
      case 'info':
        return <Info size={24} />
      case 'success':
        return <CheckCircle size={24} />
      default:
        return <AlertTriangle size={24} />
    }
  }

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!isLoading}
      showCloseButton={false}
      title={null}
    >
      <div className={styles.content}>
        <div className={clsx(styles.iconContainer, styles[`icon_${type}`])}>
          <div className={styles.iconWrapper}>
            {getIcon()}
          </div>
        </div>

        <div className={styles.textContainer}>
          <h3 className={styles.title}>{title}</h3>
          {message && <p className={styles.message}>{message}</p>}
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            fullWidth
            className={styles.cancelButton}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
            fullWidth
            className={clsx(styles.confirmButton, styles[`confirmButton_${type}`])}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

