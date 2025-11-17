import React from 'react'
import styles from '../../styles/components/ui/Badge.module.css'

export const Badge = ({ variant = 'neutral', children }) => {
  const variantClass = styles[variant] || styles.neutral

  return (
    <span className={`${styles.badge} ${variantClass}`}>
      {children}
    </span>
  )
}
