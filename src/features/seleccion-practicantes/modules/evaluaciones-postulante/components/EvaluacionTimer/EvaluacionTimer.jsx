import { useState, useEffect, useRef } from 'react'
import { Clock, AlertCircle } from 'lucide-react'
import styles from './EvaluacionTimer.module.css'

/**
 * Componente que muestra el tiempo restante de una evaluación
 */
export function EvaluacionTimer({ expiresAt, onExpire, timeLimitMinutes }) {
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isExpired, setIsExpired] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!expiresAt) {
      setTimeRemaining(null)
      return
    }

    const calculateTimeRemaining = () => {
      const now = new Date()
      const expires = new Date(expiresAt)
      const diff = expires - now

      if (diff <= 0) {
        setIsExpired(true)
        setTimeRemaining(0)
        if (onExpire) {
          onExpire()
        }
        return 0
      }

      return diff
    }

    // Calcular tiempo inicial
    const initialTime = calculateTimeRemaining()
    setTimeRemaining(initialTime)

    // Actualizar cada segundo
    intervalRef.current = setInterval(() => {
      const remaining = calculateTimeRemaining()
      setTimeRemaining(remaining)
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [expiresAt, onExpire])

  if (!expiresAt && !timeLimitMinutes) {
    return null
  }

  if (isExpired) {
    return (
      <div className={`${styles.timer} ${styles.timerExpired}`}>
        <AlertCircle size={20} />
        <span>Tiempo agotado</span>
      </div>
    )
  }

  if (timeRemaining === null) {
    return (
      <div className={styles.timer}>
        <Clock size={20} />
        <span>Sin límite de tiempo</span>
      </div>
    )
  }

  const minutes = Math.floor(timeRemaining / 60000)
  const seconds = Math.floor((timeRemaining % 60000) / 1000)
  const isWarning = minutes < 5 && minutes >= 0
  const isCritical = minutes < 2 && minutes >= 0

  return (
    <div
      className={`${styles.timer} ${isCritical ? styles.timerCritical : isWarning ? styles.timerWarning : ''}`}
    >
      <Clock size={20} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}

