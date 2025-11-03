import { LogOut } from 'lucide-react'
import styles from './SidebarFooter.module.css'

export function SidebarFooter() {
  const handleLogout = () => {
    console.log('Cerrar sesión')
  }

  return (
    <div className={styles.footer}>
      <div className={styles.userInfo}>
        <div className={styles.userAvatar}>
          <span className={styles.userAvatarText}>A</span>
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>Carlos Mendoza</p>
          <p className={styles.userEmail}>admin@rpsoft.com</p>
          <p className={styles.userRole}>Admin</p>
        </div>
      </div>
      <button onClick={handleLogout} className={styles.logoutButton}>
        <LogOut size={16} />
        <span className={styles.logoutText}>Cerrar Sesión</span>
      </button>
    </div>
  )
}

