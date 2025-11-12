import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useToast } from '@shared/components/Toast'
import { logout as logoutService } from '@features/seleccion-practicantes/modules/auth/services/authService'
import { getRefreshToken, clearAuthTokens } from '@features/seleccion-practicantes/shared/utils/cookieHelper'
import { LogoutAnimation } from './LogoutAnimation'
import styles from './SidebarFooter.module.css'

/**
 * Genera las iniciales a partir del nombre completo
 * @param {string} fullName - Nombre completo del usuario
 * @returns {string} Iniciales (máximo 2 caracteres)
 */
const getInitials = (fullName) => {
  if (!fullName || !fullName.trim()) {
    return 'U'
  }

  const parts = fullName.trim().split(/\s+/)
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  // Tomar la primera letra del primer nombre y la primera letra del último apellido
  const firstInitial = parts[0].charAt(0).toUpperCase()
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase()
  
  return `${firstInitial}${lastInitial}`
}

export function SidebarFooter() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [userData, setUserData] = useState(null)

  // Obtener datos del usuario desde localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const stored = localStorage.getItem('rpsoft_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          setUserData(parsed)
        }
      } catch (error) {
        // Si hay error al parsear, usar valores por defecto
        setUserData(null)
      }
    }

    loadUserData()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadUserData()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // También verificar periódicamente por si cambia en la misma pestaña
    const interval = setInterval(loadUserData, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setShowAnimation(true)
    
    try {
      const refreshToken = getRefreshToken()
      
      if (refreshToken) {
        // Intentar invalidar el token en el servidor
        try {
          await logoutService(refreshToken)
          toast.success('Sesión cerrada correctamente', 3000, 'Cerrar Sesión')
        } catch (error) {
          // Si falla el logout en el servidor, continuar con la limpieza local
          console.warn('Error al invalidar token en servidor:', error)
          toast.warning('Sesión cerrada localmente', 3000, 'Cerrar Sesión')
        }
      } else {
        toast.info('Sesión cerrada', 3000, 'Cerrar Sesión')
      }

      // Limpiar tokens y datos locales
      clearAuthTokens()
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
      localStorage.removeItem('rpsoft_user')
      localStorage.removeItem('rpsoft_selection_data')
      localStorage.removeItem('rpsoft_current_step')

      // La animación manejará la navegación cuando termine
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error('Error al cerrar sesión. Por favor, intenta nuevamente.', 4000, 'Error')
      setIsLoggingOut(false)
      setShowAnimation(false)
    }
  }

  const handleAnimationComplete = () => {
    // Redirigir al login después de que la animación termine
    navigate('/')
  }

  return (
    <>
      {showAnimation && (
        <LogoutAnimation onComplete={handleAnimationComplete} />
      )}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <span className={styles.userAvatarText}>
              {userData?.full_name ? getInitials(userData.full_name) : 'U'}
            </span>
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>
              {userData?.full_name || userData?.name || 'Usuario'}
            </p>
            <p className={styles.userEmail}>
              {userData?.email || 'Sin email'}
            </p>
            <p className={styles.userRole}>
              {userData?.role_name || userData?.role || 'Usuario'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className={styles.logoutButton}
          disabled={isLoggingOut}
        >
          <LogOut size={16} />
          <span className={styles.logoutText}>
            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </span>
        </button>
      </div>
    </>
  )
}
