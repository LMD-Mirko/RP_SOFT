import { Users, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react'
import styles from './InfCards.module.css'

const statsData = [
  {
    id: 'Horario',
    title: 'Ver Horario',
    value: 'Consulta tu horario semanal',
    icon: Users,
  iconColor: '#ea580c',   
  iconBgColor: '#ffedd5', 
  cardBgColor: '#fff7ed', 
  borderColor: '#fdba74'  
  },
  {
    id: 'Advertencias',
    title: 'Ver Advertencias',
    value: 'Revisa tu seguimiento disciplinario',
    icon: TrendingUp,
  iconColor: '#dc2626',    
  iconBgColor: '#fee2e2',  
  cardBgColor: '#fef2f2',  
  borderColor: '#fca5a5'   
  },

]

export function InfCards() {
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