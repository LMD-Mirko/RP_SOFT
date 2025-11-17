import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle, Bell } from 'lucide-react'
import styles from './ToastProvider.module.css'

const ToastCtx = createContext(null)

export function ToastProvider({ children, duration = 3000, max = 5 }) {
  const [list, setList] = useState([])
  const idRef = useRef(0)

  const remove = useCallback((id) => {
    setList((prev) => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback((opts) => {
    const id = ++idRef.current
    const toast = { id, type: opts.type || 'info', title: opts.title || '', message: opts.message || '', duration: opts.duration ?? duration }
    setList((prev) => {
      const next = [...prev, toast]
      return next.slice(-max)
    })
    if ((toast.duration || 0) > 0) {
      setTimeout(() => remove(id), toast.duration)
    }
    return id
  }, [duration, max, remove])

  const api = useMemo(() => ({
    success: (message, title = 'Éxito') => push({ type: 'success', message, title, duration: 2500 }),
    error: (message, title = 'Error') => push({ type: 'error', message, title, duration: 5000 }),
    info: (message, title = 'Info') => push({ type: 'info', message, title, duration: 3000 }),
    warning: (message, title = 'Aviso') => push({ type: 'warning', message, title, duration: 4500 }),
    notice: (message, title = 'Detalle') => push({ type: 'notice', message, title, duration: 3000 }),
    push,
    remove,
  }), [push, remove])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className={styles.container} aria-live="polite" aria-atomic="true">
        {list.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`} role="status">
            <div className={styles.header}>
              <span className={styles.lead}>
                {t.type === 'success' && <CheckCircle2 size={16} className={styles.icon} />}
                {t.type === 'info' && <Info size={16} className={styles.icon} />}
                {t.type === 'warning' && <AlertTriangle size={16} className={styles.icon} />}
                {t.type === 'error' && <XCircle size={16} className={styles.icon} />}
                {t.type === 'notice' && <Bell size={16} className={styles.icon} />}
                <span className={styles.title}>{t.title}</span>
              </span>
              <button className={styles.close} aria-label="Cerrar" onClick={() => remove(t.id)}>×</button>
            </div>
            {t.message ? <div className={styles.body}>{t.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
