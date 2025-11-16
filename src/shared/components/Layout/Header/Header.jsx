import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

export function Header() {
  const navigate = useNavigate()
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.actions}>
          <button className={styles.iconButton} aria-label="Notificaciones">
            <Bell size={20} className={styles.icon} />
          </button>
          <button
            className={styles.avatarButton}
            aria-label="Usuario"
            onClick={() => navigate('/gestion-tareas/usuario')}
          >
            <div className={styles.avatar}>
              <span className={styles.avatarText}>A</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

