import React from 'react'
import styles from '../styles/components/TinyLineChart.module.css'

export const TinyLineChart = ({ labels = [], ideal = [], real = [] }) => {
  const max = Math.max(1, ...ideal, ...real)
  return (
    <div className={styles.chart}>
      {labels.map((lab, i) => (
        <div
          key={i}
          className={styles.row}
          tabIndex={0}
          aria-label={`Fila ${lab}: ideal ${ideal[i]}, real ${real[i]}`}
        >
          <div className={`${styles.label} ${styles.labelText}`} title={lab}>{lab}</div>
          <div className={styles.barGroup}>
            <div className={styles.track}>
              <div
                className={styles.idealFill}
                style={{ width: `${(ideal[i] / max) * 100}%` }}
              />
            </div>
            <div className={styles.track}>
              <div
                className={styles.realFill}
                style={{ width: `${(real[i] / max) * 100}%` }}
              />
            </div>
          </div>
          <div className={styles.tooltipRow} role="tooltip">
            Ideal: {ideal[i]} • Real: {real[i]}
          </div>
        </div>
      ))}
    </div>
  )
}
