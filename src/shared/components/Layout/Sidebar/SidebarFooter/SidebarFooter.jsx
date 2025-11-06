import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from './SidebarFooter.module.css'

export function SidebarFooter() {
  const navigate = useNavigate()
  const handleLogout = () => {
    // TODO: Implementar lógica de logout
    console.log('Cerrar sesión')
  }

  return (
    <div className={styles.footer}>
      <div className={styles.userInfo} onClick={() => navigate('/gestion-tareas/usuario')} role="button" tabIndex={0}>
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

