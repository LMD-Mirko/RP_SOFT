import { Users, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react'
import styles from './StatsCards.module.css'

const statsData = [
  {
    id: 'Estado',
    title: 'Estado',
    value: 'Activo',
    icon: Users,
        iconColor: '#22c55e',
    iconBgColor: '#d1fae5',
    cardBgColor: '#ecfdf5',
    borderColor: '#86efac'
  },
  {
    id: 'Activos',
    title: 'Asistencia',
    value: '92%',
    icon: TrendingUp,
    iconColor: '#2563eb',
    iconBgColor: '#dbeafe',
    cardBgColor: '#eff6ff',
    borderColor: '#60a5fa'
  },
  {
    id: 'Actualizacion',
    title: 'Última actualización',
    value: '23 Oct 2025',
    icon: AlertCircle,
    iconColor: '#7e22ce',   
    iconBgColor: '#ede9fe', 
    cardBgColor: '#f5f3ff', 
    borderColor: '#c4b5fd' 
  },
]

export function StatsCards() {
  return (
    <div className={styles.statsGrid}>
      {statsData.map(stat => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            className={styles.statCard}
            style={{
              backgroundColor: stat.cardBgColor,
              borderColor: stat.borderColor
            }}
          >
            <div className={styles.statContent}>
              <div
                className={styles.iconContainer}
                style={{
                  color: stat.iconColor
                }}
              >
                <Icon size={48} />
              </div>
              <div className={styles.statOrder}>
                <div className={styles.statTitle}>{stat.title}</div>
                <div className={styles.statValue}>{stat.value}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}