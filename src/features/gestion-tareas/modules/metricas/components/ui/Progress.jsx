import React from 'react'
import styles from '../../styles/components/ui/Progress.module.css'

export const Progress = ({ value = 0, max = 100, color }) => {
  const percent = (value / max) * 100
  const variant = styles[color] || styles.blue

  return (
    <div className={styles.track}>
      <div
        className={`${styles.bar} ${variant}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
