import { AlertTriangle, AlertCircle, Clock } from 'lucide-react'
import styles from './AlertCards.module.css'

const alertsData = [
  {
    id: 'tardanza-potencial',
    title: 'Tardanza potencial detectada',
    count: 3,
    time: '8:05 a.m. +15 min. de 1 minuto aplicado',
    people: ['Carlos Méndoza', 'Juan Pérez', 'Luis Ramírez'],
    icon: AlertTriangle,
    iconColor: '#eab308',
    bgColor: '#fefce8',
    borderColor: '#fde047',
    actionText: 'Ver detalles'
  },
  {
    id: 'ausencias-sin-registro',
    title: 'Ausencias sin clase registrada',
    count: 2,
    time: '8:05 a.m. +30 min. de clase programada hoy',
    people: ['María González', 'Pedro Sánchez'],
    icon: AlertCircle,
    iconColor: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    actionText: 'Ver detalles'
  },
  {
    id: 'practicantes-riesgo',
    title: 'Practicantes en riesgo',
    count: 1,
    time: '9:30 a.m. +30 min. del último día observado',
    people: ['Jorge Vega'],
    icon: Clock,
    iconColor: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#fdba74',
    actionText: 'Ver detalles'
  }
]

export function AlertCards() {
  return (
    <div className={styles.alertsSection}>
      <h2 className={styles.sectionTitle}>Alertas Automáticas</h2>
      <div className={styles.alertsGrid}>
        {alertsData.map(alert => {
          const Icon = alert.icon
          return (
            <div
              key={alert.id}
              className={styles.alertCard}
              style={{
                backgroundColor: alert.bgColor,
                borderColor: alert.borderColor
              }}
            >
              <div className={styles.alertHeader}>
                <div className={styles.alertIcon} style={{ color: alert.iconColor }}>
                  <Icon size={20} />
                </div>
                <div className={styles.alertHeaderContent}>
                  <div className={styles.alertTitle}>{alert.title}</div>
                  <div className={styles.alertCount}>{alert.count}</div>
                </div>
                <button className={styles.moreButton}>›</button>
              </div>
              <div className={styles.alertTime}>{alert.time}</div>
              <div className={styles.alertPeople}>
                {alert.people.map((person, index) => (
                  <div key={index} className={styles.personTag}>• {person}</div>
                ))}
              </div>
              <button className={styles.alertAction}>{alert.actionText}</button>
            </div>
          )
        })}
      </div>

      <div className={styles.alertConfig}>
        <div className={styles.configIcon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2v2M10 16v2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M2 10h2M16 10h2M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="3" stroke="#64748b" strokeWidth="2"/>
          </svg>
        </div>
        <div className={styles.configContent}>
          <strong>Configuración de alertas</strong>
          <ul>
            <li>8:05 a.m. — Cierre de tardanza sin inicial de que 8 min.</li>
            <li>8:20 a.m. — Cierre de ausencia sin clase registrada</li>
            <li>9a / 1:00 del día — Análisis de practicantes en riesgo</li>
            <li>Sin Dato de ocupo - Envío de la asistencia (Cada viernes 5:00)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
