import { EmptyState } from '@shared/components/EmptyState'
import styles from './RecentActivity.module.css'

export function RecentActivity({ activities = [], loading = false }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Actividad Reciente</h2>
      
      <div className={styles.list}>
        {loading ? (
          <EmptyState
            iconPreset="activity"
            colorPreset="dark"
            iconColor="#0f172a"
            title="Cargando actividades..."
            description="Por favor espera mientras cargamos la información"
            className={styles.emptyState}
          />
        ) : activities.length === 0 ? (
          <EmptyState
            iconPreset="activity"
            colorPreset="dark"
            iconColor="#0f172a"
            title="No hay actividad reciente"
            description="Los registros de actividad aparecerán aquí cuando haya movimientos en el sistema"
            className={styles.emptyState}
          />
        ) : (
          activities.map((activity, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.bullet}></div>
              <div className={styles.content}>
                <p className={styles.description}>{activity.description}</p>
                <p className={styles.name}>{activity.name}</p>
                <p className={styles.time}>{activity.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
