import { Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import styles from './HoursWorked.module.css'
import HoursDetail from './HourDetail'

const statsData = [
  {
    id: 'cumplimiento',
    title: 'Cumpliendo Meta',
    value: '0',
    subtitle: '≥30h semanales',
    icon: CheckCircle,
    iconColor: '#10b981',
    iconBgColor: '#d1fae5',
    cardBgColor: '#ecfdf5',
    borderColor: '#6ee7b7'
  },
  {
    id: 'en-advertencia',
    title: 'En Advertencia',
    value: '0',
    subtitle: '20-29h semanales',
    icon: AlertCircle,
    iconColor: '#f97316',
    iconBgColor: '#fed7aa',
    cardBgColor: '#fff7ed',
    borderColor: '#fdba74'
  },
  {
    id: 'criticos',
    title: 'Críticos',
    value: '8',
    subtitle: '<20h semanales',
    icon: AlertCircle,
    iconColor: '#ec4899',
    iconBgColor: '#fbcfe8',
    cardBgColor: '#fdf2f8',
    borderColor: '#f472b6'
  },
  {
    id: 'horas-faltantes',
    title: 'Horas Faltantes',
    value: '211.5h',
    subtitle: 'Para alcanzar meta',
    icon: Clock,
    iconColor: '#6366f1',
    iconBgColor: '#e0e7ff',
    cardBgColor: '#f0f4ff',
    borderColor: '#818cf8'
  }
]

export function HoursWorked() {
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
              <div className={styles.statSubtitle}>{stat.subtitle}</div>
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