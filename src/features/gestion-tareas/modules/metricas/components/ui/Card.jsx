import React from 'react'
import styles from '../../styles/components/ui/Card.module.css'

export const Card = ({ title, value, icon: Icon, color }) => {
  const circleVariant = styles[color] || styles.gray

  return (
    <div className={styles.card} data-title={title} data-value={value} tabIndex={0}>
      <div className={styles.row}>
        <div className={`${styles.iconCircle} ${circleVariant}`} tabIndex={-1}>
          {Icon && <Icon size={24} />}
        </div>
        <div>
          <div className={styles.titleMuted}>{title}</div>
          <div className={styles.value}>{value}</div>
        </div>
      </div>
    </div>
  )
}
