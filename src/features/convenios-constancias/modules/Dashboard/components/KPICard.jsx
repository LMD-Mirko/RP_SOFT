/**
 * Componente KPICard
 * Tarjeta para mostrar métricas clave (KPIs) del dashboard
 */

import styles from '../styles/Dashboard.module.css'

export function KPICard({ title, value, description, iconComponent, iconColor }) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiContent}>
        <div className={styles.kpiInfo}>
          <p className={styles.kpiTitle}>{title}</p>
          <p className={styles.kpiValue}>{value}</p>
          <p className={styles.kpiDescription}>{description}</p>
        </div>
        <div className={styles.kpiIconWrapper}>
          {iconComponent ? (() => { const IconComp = iconComponent; return <IconComp size={24} className={styles.kpiIcon} style={{ color: iconColor }} /> })() : null}
        </div>
      </div>
    </div>
  )
}
