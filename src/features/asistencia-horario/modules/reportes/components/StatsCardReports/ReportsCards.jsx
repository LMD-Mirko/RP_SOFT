import { Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import styles from './ReportsCards.module.css'

const statsData = [
  {
    id: 'horas-totales',
    title: 'Horas Totales',
    value: '28.5h',
    subtitle: 'Esta semana',
    icon: Clock,
    iconColor: '#6366f1',
    iconBgColor: '#e0e7ff',
    cardBgColor: '#f0f4ff',
    borderColor: '#818cf8'
  },
  {
    id: 'meta-semanal',
    title: 'Meta Semanal',
    value: '240h',
    subtitle: 'Objetivo colectivo',
    icon: TrendingUp,
    iconColor: '#10b981',
    iconBgColor: '#d1fae5',
    cardBgColor: '#ecfdf5',
    borderColor: '#6ee7b7'
  },
  {
    id: 'cumplimiento',
    title: 'Cumplimiento',
    value: '12%',
    subtitle: 'Meta general',
    icon: CheckCircle,
    iconColor: '#f97316',
    iconBgColor: '#fed7aa',
    cardBgColor: '#fff7ed',
    borderColor: '#fdba74'
  },
  {
    id: 'horas-faltantes',
    title: 'Horas Faltantes',
    value: '211.5h',
    subtitle: 'Para meta completa',
    icon: AlertCircle,
    iconColor: '#ef4444',
    iconBgColor: '#fee2e2',
    cardBgColor: '#fef2f2',
    borderColor: '#fca5a5'
  }
]

export function ReportsCards() {
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