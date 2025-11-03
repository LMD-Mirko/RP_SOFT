import styles from './SidebarHeader.module.css'

export function SidebarHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <span className={styles.logoText}>RP</span>
        </div>
        <span className={styles.title}>RP SOFT</span>
      </div>
    </div>
  )
}

