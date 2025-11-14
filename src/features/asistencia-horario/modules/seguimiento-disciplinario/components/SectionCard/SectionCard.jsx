import React from 'react'
import styles from './SectionCard.module.css'

export default function SectionCard({ title, children }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      {children}
    </div>
  )
}
