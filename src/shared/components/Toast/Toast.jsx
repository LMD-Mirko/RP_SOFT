import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'
import styles from './Toast.module.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000, title) => {
    const id = Date.now()
    const newToast = { id, message, type, duration, title }
    
    setToasts(prev => [...prev, newToast])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    success: (message, duration, title = '¡Éxito!') => addToast(message, 'success', duration, title),
    error: (message, duration, title = 'Error') => addToast(message, 'error', duration, title),
    warning: (message, duration, title = 'Advertencia') => addToast(message, 'warning', duration, title),
    info: (message, duration, title = 'Información') => addToast(message, 'info', duration, title),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <AlertCircle size={20} />
      case 'warning':
        return <AlertTriangle size={20} />
      case 'info':
      default:
        return <Info size={20} />
    }
  }

  return (
    <div className={clsx(styles.toast, styles[toast.type])}>
      <div className={styles.iconContainer}>
        <div className={styles.iconGlow} />
        <div className={styles.iconWrapper}>
          {getIcon()}
        </div>
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{toast.title}</h4>
        <p className={styles.message}>{toast.message}</p>
      </div>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider')
  }
  return context
}

