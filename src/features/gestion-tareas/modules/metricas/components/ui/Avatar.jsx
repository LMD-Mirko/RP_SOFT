import React from 'react'
import styles from '../../styles/components/ui/Avatar.module.css'

export const Avatar = ({ initials }) => (
  <div className={styles.avatar}>
    {initials}
  </div>
)
