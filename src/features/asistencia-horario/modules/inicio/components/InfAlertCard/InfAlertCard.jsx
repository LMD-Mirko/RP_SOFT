import { Users, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react'
import styles from './InfAlertCard.module.css'

const statsData = [
  {
    id: 'Alertas',
    title: 'Alertas Personales',
    value1: '·No hay advertencias activas. ¡Excelente trabajo!',
    value2: '·Recomendación: Mantén tu puntualidad para alcanzar la meta mensual.',
    icon: AlertCircle,
    iconColor: '#000000ff',
    iconBgColor: '#ffffffff',
    cardBgColor: '#ffffffff',
    borderColor: '#000000ff'
  },
]

export function InfAlertCard() {
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
                <Icon size={24} />
                  <div className={styles.statTitle}>{stat.title}</div>
              </div>
              <div className={styles.statOrder}>
                <div className={styles.statValue1}>{stat.value1}</div>
                <div className={styles.statValue2}>{stat.value2}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}