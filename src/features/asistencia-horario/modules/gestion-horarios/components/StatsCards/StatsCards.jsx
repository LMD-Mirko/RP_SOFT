import { Users, Calendar, Clock, AlertTriangle } from 'lucide-react'
import styles from './StatsCards.module.css'

const statsData = [
  {
    id: 'con-horario',
    title: 'Practicantes con Horario',
    value: '142/150',
    icon: Users,
    iconColor: '#2563eb',
    iconBgColor: '#dbeafe',
    cardBgColor: '#eff6ff',
    borderColor: '#60a5fa'
  },
  {
    id: 'clases-hoy',
    title: 'Clases Hoy',
    value: '23',
    icon: Calendar,
    iconColor: '#9333ea',
    iconBgColor: '#e9d5ff',
    cardBgColor: '#e9d5ff',
    borderColor: '#c084fc'
  },
  {
    id: 'clases-parciales',
    title: 'Clases Parciales',
    value: '8',
    icon: Clock,
    iconColor: '#16a34a',
    iconBgColor: '#d1fae5',
    cardBgColor: '#D9FAD3',
    borderColor: '#86efac'
  },
  {
    id: 'sin-horario',
    title: 'Sin Horario Registrado',
    value: '8',
    icon: AlertTriangle,
    iconColor: '#dc2626',
    iconBgColor: '#fecaca',
    cardBgColor: '#fecaca',
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
