import { Users, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react'
import styles from './StatsCards.module.css'

const statsData = [
  {
    id: 'total',
    title: 'Total Practicantes',
    value: '5',
    icon: Users,
    iconColor: '#2563eb',
    iconBgColor: '#dbeafe',
    cardBgColor: '#eff6ff',
    borderColor: '#60a5fa'
  },
  {
    id: 'activos',
    title: 'Activos',
    value: '4',
    icon: TrendingUp,
    iconColor: '#22c55e',
    iconBgColor: '#d1fae5',
    cardBgColor: '#ecfdf5',
    borderColor: '#86efac'
  },
  {
    id: 'recuperacion',
    title: 'En Recuperación',
    value: '1',
    icon: AlertCircle,
    iconColor: '#f59e0b',
    iconBgColor: '#fef3c7',
    cardBgColor: '#fffbeb',
    borderColor: '#fcd34d'
  },
  {
    id: 'riesgo',
    title: 'En Riesgo',
    value: '1',
    icon: AlertCircle,
    iconColor: '#ef4444',
    iconBgColor: '#fee2e2',
    cardBgColor: '#fef2f2',
    borderColor: '#fca5a5'
  }
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
              <div className={styles.statTitle}>{stat.title}</div>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
            <div className={styles.statHeader}>
              <div
                className={styles.iconContainer}
                style={{
                  color: stat.iconColor
                }}
              >
                <Icon size={48} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}