import clsx from 'clsx'
import styles from './StatsCard.module.css'

export function StatsCard({
  title,
  value,
  detail,
  icon: Icon,
  iconColor,
  detailColor = 'default',
  index = 0,
}) {
  return (
    <div 
      className={styles.card}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Contenido Principal */}
      <div className={styles.content}>
        <p className={styles.value}>{value}</p>
        <p className={styles.title}>{title}</p>
        <p className={clsx(styles.detail, styles[`detail_${detailColor}`])}>
          {detail}
        </p>
      </div>
      
      {/* Icono en cuadrado de color */}
      <div className={clsx(styles.iconContainer, styles[`iconContainer_${iconColor}`])}>
        <Icon size={24} className={styles.icon} />
      </div>
    </div>
  )
}
