import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
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
  centered = false,
  rounded = true,
  zIndex,
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
      if (e.key === 'Escape' && isOpen && closeOnOverlayClick && onClose) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnOverlayClick])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const isCompact = !title && !showCloseButton
  const useTopAlignment = isCompact && !centered
  const isFullscreen = size === 'fullscreen'

  const overlayStyle = zIndex ? { zIndex } : {}

  const modalContent = (
    <div 
      className={clsx(styles.overlay, useTopAlignment && styles.overlayTop, isFullscreen && styles.overlayNoPadding)} 
      onClick={handleOverlayClick}
      style={overlayStyle}
    >
      <div className={clsx(styles.modal, styles[size], useTopAlignment && styles.modalTop, !rounded && styles.square, className)}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {showCloseButton && onClose && (
              <button onClick={onClose} className={styles.closeButton} type="button" disabled={!closeOnOverlayClick}>
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

  // Renderizar el modal en un portal directamente en el body para que esté por encima de todo
  return createPortal(modalContent, document.body)
}

// Subcomponentes para mejor estructura
Modal.Body = function ModalBody({ children, className }) {
  return <div className={clsx(styles.body, className)}>{children}</div>
}

Modal.Footer = function ModalFooter({ children, className }) {
  return <div className={clsx(styles.footer, className)}>{children}</div>
}

