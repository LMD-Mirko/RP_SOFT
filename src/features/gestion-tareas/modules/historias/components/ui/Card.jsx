import styles from '../../styles/Card.module.css'

export const Card = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: styles.blue,
    orange: styles.orange,
    green: styles.green,
    violet: styles.violet,
  }
  const colorClass = colors[color] || colors.blue
  return (
    <div className={styles.card}>
      <div>
        <div className={`${styles.iconContainer} ${colorClass}`}>
          <Icon size={24} />
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  )
}
