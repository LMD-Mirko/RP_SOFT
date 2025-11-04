import clsx from 'clsx'
import styles from './UpcomingInterviews.module.css'

const STATUS_COLORS = {
  confirmada: 'success',
  pendiente: 'warning',
  reservada: 'success',
}

export function UpcomingInterviews({ interviews = [] }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Próximas Entrevistas</h2>
      
      <div className={styles.list}>
        {interviews.length === 0 ? (
          <p className={styles.empty}>No hay entrevistas programadas</p>
        ) : (
          interviews.map((interview, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.content}>
                <p className={styles.name}>{interview.name}</p>
                <p className={styles.date}>{interview.date}</p>
              </div>
              <span
                className={clsx(
                  styles.status,
                  styles[`status_${STATUS_COLORS[interview.status] || 'default'}`]
                )}
              >
                {interview.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
