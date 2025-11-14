import React from 'react'
import styles from './classCard.module.css'

export default function ClassCard({ titulo, instructor, duracion }) {
  return (
    <div className={styles.cardGroup}>
      <article className={styles.classCard}>
      <h4 className={styles.classTitle}>{titulo}</h4>
      <p className={styles.classInstructor}>{instructor}</p>
      <p className={styles.classDuration}>{duracion}</p>
    </article>
    </div>
    
  )
}
