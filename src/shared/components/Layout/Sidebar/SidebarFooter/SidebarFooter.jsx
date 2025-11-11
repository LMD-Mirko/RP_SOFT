import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useToast } from '@shared/components/Toast'
import { logout as logoutService } from '@features/seleccion-practicantes/modules/auth/services/authService'
import { getRefreshToken, clearAuthTokens } from '@features/seleccion-practicantes/shared/utils/cookieHelper'
import styles from './SidebarFooter.module.css'

export function SidebarFooter() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
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

      // Redirigir al login después de un breve delay para que se vea el toast
      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error('Error al cerrar sesión. Por favor, intenta nuevamente.', 4000, 'Error')
      setIsLoggingOut(false)
    }
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
  )
}

