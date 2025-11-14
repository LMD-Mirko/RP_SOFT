import { useNavigate } from 'react-router-dom'
import styles from './PracticanteCard.module.css'

const getStatusConfig = (estado) => {
  switch (estado.toLowerCase()) {
    case 'activo':
      return {
        label: 'Activo',
        className: styles.statusActive,
        badgeColor: '#10b981'
      }
    case 'recuperacion':
      return {
        label: 'En Recuperación',
        className: styles.statusRecovery,
        badgeColor: '#f59e0b'
      }
    case 'riesgo':
      return {
        label: 'En Riesgo',
        className: styles.statusRisk,
        badgeColor: '#ef4444'
      }
    case 'inactivo':
      return {
        label: 'Inactivo',
        className: styles.statusDefault,
        badgeColor: '#6b7280'
      }
    default:
      return {
        label: estado,
        className: styles.statusDefault,
        badgeColor: '#6b7280'
      }
  }
}

const getScoreColor = (score) => {
  if (score >= 800) return '#10b981' // Verde
  if (score >= 600) return '#f59e0b' // Amarillo
  if (score >= 400) return '#f97316' // Naranja
  return '#ef4444' // Rojo
}

export function PracticanteCard({ practicante }) {
  const navigate = useNavigate()
  const statusConfig = getStatusConfig(practicante.estado)
  const scoreColor = getScoreColor(practicante.score)

  const handleClick = () => {
    navigate(`/asistencia-horario/practicantes/${practicante.id}`)
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          <div 
            className={styles.avatar}
            style={{ backgroundColor: practicante.color }}
          >
            {practicante.avatar}
          </div>
          <div className={styles.info}>
            <h3 className={styles.name}>{practicante.nombre}</h3>
            <p className={styles.email}>{practicante.email}</p>
            <p className={styles.team}>{practicante.equipo}</p>
          </div>
        </div>
      </div>

      <div className={styles.statusSection}>
        <div className={styles.statusBadges}>
          <span className={`${styles.statusBadge} ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
          {practicante.estado === 'recuperacion' && (
            <span className={styles.recoveryBadge}>
              En Observación
            </span>
          )}
          {practicante.estado === 'activo' && practicante.score >= 800 && (
            <span className={styles.excellentBadge}>
              Destacado
            </span>
          )}
        </div>
        <p className={styles.cohort}>{practicante.cohorte}</p>
      </div>

      <div className={styles.metricsSection}>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Score</span>
            <span 
              className={styles.metricValue}
              style={{ color: scoreColor }}
            >
              {practicante.score}
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Asistencia</span>
            <span className={styles.metricValue}>
              {practicante.asistencia}
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Infracciones</span>
            <span 
              className={styles.metricValue}
              style={{ 
                color: practicante.infracciones > 0 ? '#ef4444' : '#10b981' 
              }}
            >
              {practicante.infracciones}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}