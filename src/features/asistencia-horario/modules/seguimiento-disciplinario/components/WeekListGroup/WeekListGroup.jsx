import React from 'react'
import WeekEventRow from '../WeekEventRow/WeekEventRow'
import styles from './WeekListGroup.module.css'

export default function WeekListGroup({ dia, actividades }) {
  return (
    <div className={styles.weekListGroup}>
      <div className={styles.eventDay}>{dia}</div>

      <div className={styles.ListVoid}>
        <div className={styles.state}>
          {actividades.map((act, idx) => (
            <WeekEventRow key={idx} {...act} />
          ))}
        </div>
      </div>
      
    </div>
  )
}
