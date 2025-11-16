import React from 'react'
import styles from '../styles/components/TinyBarChart.module.css'

export const TinyBarChart = ({ labels = [], values = [] }) => {
  const max = Math.max(1, ...values)
  return (
    <div className={styles.chart}>
      {values.map((v, i) => (
        <div
          key={i}
          className={styles.group}
          tabIndex={0}
          aria-label={`Barra ${labels[i]} valor ${v}`}
        >
          <div className={styles.track}>
            <div
              className={styles.fill}
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
          <div className={`${styles.label} ${styles.labelTruncate}`} title={labels[i]}>
            {labels[i]}
          </div>
          <div className={styles.tooltip} role="tooltip">
            {labels[i]}: {v}
          </div>
        </div>
      ))}
    </div>
  )
}
