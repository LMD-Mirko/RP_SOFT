import { X } from 'lucide-react'
import { useEffect } from 'react'
import styles from './Modal.module.css'
import clsx from 'clsx'

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const isCompact = !title && !showCloseButton

  return (
    <div className={clsx(styles.overlay, isCompact && styles.overlayTop)} onClick={handleOverlayClick}>
      <div className={clsx(styles.modal, styles[size], isCompact && styles.modalTop, className)}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {showCloseButton && (
              <button onClick={onClose} className={styles.closeButton} type="button">
                <X size={24} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Subcomponentes para mejor estructura
Modal.Body = function ModalBody({ children, className }) {
  return <div className={clsx(styles.body, className)}>{children}</div>
}

Modal.Footer = function ModalFooter({ children, className }) {
  return <div className={clsx(styles.footer, className)}>{children}</div>
}

