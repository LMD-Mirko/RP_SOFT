import { Sidebar } from './Sidebar'
import styles from './Layout.module.css'

export function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}