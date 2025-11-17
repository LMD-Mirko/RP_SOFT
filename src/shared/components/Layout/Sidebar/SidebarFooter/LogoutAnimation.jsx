import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import styles from './LogoutAnimation.module.css'

export function LogoutAnimation({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animación de progreso suave
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 20)

    // Completar animación después de 1.2 segundos
    const timer = setTimeout(() => {
      clearInterval(interval)
      if (onComplete) {
        onComplete()
      }
    }, 1200)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop}></div>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconCircle}>
            <LogOut className={styles.icon} size={32} />
          </div>
        </div>
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>Cerrando sesión</h2>
          <p className={styles.subtitle}>Hasta pronto</p>
        </div>
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className={styles.gridPattern}></div>
    </div>
  )
}

