import React from 'react'
import styles from './ComplianceSummary.module.css'

export default function ComplianceSummary({
  title = 'Resumen de Cumplimiento',
  description = 'Análisis general del cumplimiento de la meta de 30h semanales',
  totalHours = 28.5,
  weeklyTarget = 240,
  employees = { good: 0, improve: 0, critical: 8 },
  note = ''
}) {
  const percent = Math.round((totalHours / weeklyTarget) * 100)
  const remaining = Math.max(0, weeklyTarget - totalHours)

  return (
    <section className={styles.resumen}>
      <h3>{title}</h3>
      <p className={styles.desc}>{description}</p>

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.row}><span>Total horas trabajadas:</span></div>
          <div className={styles.row}><span>Meta total semanal:</span></div>
          <div className={styles.row}><span>Cumplimiento general:</span></div>
        </div>

        <div className={styles.center}>
          <div className={styles.value}>{totalHours}h</div>
          <div className={styles.value}>{weeklyTarget}h</div>
          <div className={styles.value}>{percent}%</div>
        </div>

        <div className={styles.right}>
          <div className={styles.stat}><span className={styles.good}>Empleados cumpliendo:</span><strong>{employees.good}/8</strong></div>
          <div className={styles.stat}><span className={styles.warn}>Necesitan mejorar:</span><strong>{employees.improve}/8</strong></div>
          <div className={styles.stat}><span className={styles.crit}>Situación crítica:</span><strong>{employees.critical}/8</strong></div>
        </div>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressLabel}>Progreso hacia meta colectiva:</div>
        <div className={styles.progressBar} role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
          <div className={styles.progressFill} style={{ width: `${Math.min(100, percent)}%` }} />
        </div>
        <div className={styles.progressFooter}><span>Faltan {remaining}h para que todos cumplan la meta semanal</span><strong>{totalHours} / {weeklyTarget}h</strong></div>
      </div>

      {note && <div className={styles.note}>{note}</div>}
    </section>
  )
}
