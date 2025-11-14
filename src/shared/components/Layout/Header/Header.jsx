import { useState, useEffect } from 'react'
import { Bell, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '@shared/context/UserProfileContext'
import styles from './Header.module.css'

export function Header() {
  const navigate = useNavigate()
  const { profileImageUrl } = useUserProfile()
  const [imageKey, setImageKey] = useState(0)

  // Escuchar cambios en la imagen de perfil para forzar actualización
  useEffect(() => {
    const handleProfileUpdate = () => {
      // Incrementar el key para forzar el re-render de la imagen
      setImageKey(prev => prev + 1)
    }

    window.addEventListener('userProfileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate)
    }
  }, [])

  // Obtener iniciales del usuario desde localStorage
  const getUserInitials = () => {
    try {
      const userData = localStorage.getItem('rpsoft_user')
      if (userData) {
        const user = JSON.parse(userData)
        const name = user.name || ''
        const paternalLastname = user.paternal_lastname || ''
        if (name && paternalLastname) {
          return `${name[0]}${paternalLastname[0]}`.toUpperCase()
        }
        if (name) {
          return name[0].toUpperCase()
        }
        if (user.email) {
          return user.email[0].toUpperCase()
        }
      }
    } catch (error) {
      console.error('Error al obtener iniciales:', error)
    }
    return 'U'
  }

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
            onClick={() => navigate('/seleccion-practicantes/perfil')}
          >
            <div className={styles.avatar}>
              {profileImageUrl ? (
                <img 
                  key={`${imageKey}-${profileImageUrl}`}
                  src={profileImageUrl}
                  alt="Perfil" 
                  className={styles.avatarImage}
                  onError={(e) => {
                    // Si falla la carga, mostrar iniciales
                    e.target.style.display = 'none'
                    const parent = e.target.parentElement
                    if (parent && !parent.querySelector(`.${styles.avatarText}`)) {
                      const span = document.createElement('span')
                      span.className = styles.avatarText
                      span.textContent = getUserInitials()
                      parent.appendChild(span)
                    }
                  }}
                />
              ) : (
                <span className={styles.avatarText}>{getUserInitials()}</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

