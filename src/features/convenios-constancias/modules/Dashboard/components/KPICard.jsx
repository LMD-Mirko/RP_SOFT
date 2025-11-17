/**
 * Componente KPICard
 * Tarjeta para mostrar métricas clave (KPIs) del dashboard
 */

import styles from '../styles/Dashboard.module.css'

export function KPICard({ title, value, description, icon: Icon, iconColor }) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiContent}>
        <div className={styles.kpiInfo}>
          <p className={styles.kpiTitle}>{title}</p>
          <p className={styles.kpiValue}>{value}</p>
          <p className={styles.kpiDescription}>{description}</p>
        </div>
        <div className={styles.kpiIconWrapper}>
          <Icon size={24} className={styles.kpiIcon} style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  )
}
