import { UserPlus, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react'
import styles from './NewUsersList.module.css'

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

export function NewUsersList({ 
  users = [], 
  title = 'Nuevos Usuarios',
  period = 'week',
  loading = false 
}) {
  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.empty}>Cargando usuarios...</p>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.empty}>No hay usuarios nuevos</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.badge}>
          <UserPlus size={16} />
          <span>{users.length}</span>
        </div>
      </div>
      <div className={styles.list}>
        {users.slice(0, 10).map((user, index) => (
          <div key={user.user_id || index} className={styles.userItem}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user.name || user.username || 'Usuario sin nombre'}
                {user.is_active ? (
                  <CheckCircle size={14} className={styles.activeIcon} />
                ) : (
                  <XCircle size={14} className={styles.inactiveIcon} />
                )}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userDetail}>
                  <Mail size={12} />
                  <span>{user.email || 'Sin email'}</span>
                </div>
                <div className={styles.userDetail}>
                  <Calendar size={12} />
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
            <div className={styles.userMeta}>
              <span className={styles.username}>@{user.username || 'N/A'}</span>
            </div>
          </div>
        ))}
        {users.length > 10 && (
          <div className={styles.more}>
            <span>Y {users.length - 10} más...</span>
          </div>
        )}
      </div>
    </div>
  )
}

