import styles from './RecentActivity.module.css'

export function RecentActivity({ activities = [] }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Actividad Reciente</h2>
      
      <div className={styles.list}>
        {activities.length === 0 ? (
          <p className={styles.empty}>No hay actividad reciente</p>
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
