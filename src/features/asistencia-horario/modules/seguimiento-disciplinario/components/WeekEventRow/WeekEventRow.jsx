import React from 'react'
import styles from './WeekEventRow.module.css'

export default function WeekEventRow({ hora, actividad }) {
  return (
    <div className={styles.eventRow}>
      <div className={styles.eventDetails}>
        <div className={styles.eventTime}>{hora}</div>
        <div className={styles.eventTitle}>{actividad}</div>
      </div>
    </div>
    
  )
}
