import React from 'react'
import styles from '../../styles/components/ui/Button.module.css'

export const Button = ({ variant = 'light', children, ...props }) => {
  const variantClass = styles[variant] || styles.light

  return (
    <button className={`${styles.button} ${variantClass}`} {...props}>
      {children}
    </button>
  )
}
