import { AlertTriangle, X } from 'lucide-react'
import styles from '../styles/ConfirmModal.module.css'
import { Button } from './ui/Button'
import { useEffect } from 'react'

export function ConfirmModal({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <AlertTriangle size={18} />
            <h3 className={styles.title}>{title}</h3>
          </div>
          <button className={styles.closeBtn} onClick={onCancel} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <Button variant="light" onClick={onCancel}>Cancelar</Button>
            <Button variant="dark" onClick={onConfirm}>Confirmar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}