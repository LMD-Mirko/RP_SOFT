import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useToast } from '@shared/components/Toast'
import { useUserProfile } from '@shared/context/UserProfileContext'
import { logout as logoutService } from '@features/seleccion-practicantes/modules/auth/services/authService'
import { getRefreshToken, clearAuthTokens } from '@features/seleccion-practicantes/shared/utils/cookieHelper'
import { setLoggingOut } from '@features/seleccion-practicantes/services/methods'
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
  const { profileImageUrl } = useUserProfile()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [userData, setUserData] = useState(null)
  const [imageKey, setImageKey] = useState(0)

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

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setShowAnimation(true)
    
    // Marcar que estamos en proceso de logout para suprimir errores de peticiones
    setLoggingOut(true)
    // También marcar en sessionStorage para que Toast pueda verificar
    sessionStorage.setItem('rpsoft_logging_out', 'true')
    
    try {
      const refreshToken = getRefreshToken()
      
      if (refreshToken) {
        // Intentar invalidar el token en el servidor
        try {
          await logoutService(refreshToken)
          toast.success('Sesión cerrada correctamente', 3000, 'Cerrar Sesión')
        } catch (error) {
          // Si falla el logout en el servidor, continuar con la limpieza local
          // No mostrar error durante logout
          console.warn('Error al invalidar token en servidor:', error)
        }
      }

      // Limpiar todas las cookies
      clearAuthTokens()
      
      // Limpiar todas las cookies manualmente (por si hay otras)
      // Obtener todas las cookies del dominio actual
      const cookies = document.cookie.split(';')
      const domain = window.location.hostname
      const paths = ['/', '/seleccion-practicantes', '/configuracion', '/agente-integrador']
      
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        
        if (name) {
          // Intentar eliminar la cookie con diferentes configuraciones
          const expiration = 'expires=Thu, 01 Jan 1970 00:00:00 UTC'
          
          // Eliminar con diferentes paths
          paths.forEach(path => {
            document.cookie = `${name}=; ${expiration}; path=${path};`
            document.cookie = `${name}=; ${expiration}; path=${path}; domain=${domain};`
            document.cookie = `${name}=; ${expiration}; path=${path}; domain=.${domain};`
            document.cookie = `${name}=; ${expiration}; path=${path}; SameSite=Strict;`
            document.cookie = `${name}=; ${expiration}; path=${path}; SameSite=Lax;`
            document.cookie = `${name}=; ${expiration}; path=${path}; SameSite=None; Secure;`
          })
        }
      })

      // Limpiar todo localStorage
      try {
        // Limpiar items específicos conocidos
        localStorage.removeItem('authToken')
        localStorage.removeItem('rpsoft_user')
        localStorage.removeItem('rpsoft_selection_data')
        localStorage.removeItem('rpsoft_current_step')
        
        // Limpiar todos los intentos de exámenes almacenados
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.startsWith('exam_attempt_') || key.startsWith('rpsoft_') || key.startsWith('auth'))) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Limpiar todo localStorage si es necesario (comentado por seguridad)
        // localStorage.clear()
      } catch (error) {
        console.error('Error al limpiar localStorage:', error)
      }

      // Limpiar todo sessionStorage
      try {
        sessionStorage.removeItem('authToken')
        // Limpiar todo sessionStorage
        sessionStorage.clear()
      } catch (error) {
        console.error('Error al limpiar sessionStorage:', error)
      }

      // La animación manejará la navegación cuando termine
    } catch (error) {
      // No mostrar errores durante el logout
      console.error('Error al cerrar sesión:', error)
      setIsLoggingOut(false)
      setShowAnimation(false)
      setLoggingOut(false)
      sessionStorage.removeItem('rpsoft_logging_out')
    }
  }

  const handleAnimationComplete = () => {
    // Asegurar que la bandera de logout esté activa hasta la redirección
    setLoggingOut(true)
    sessionStorage.setItem('rpsoft_logging_out', 'true')
    // Redirigir al login después de que la animación termine
    navigate('/')
    // Limpiar la bandera después de un breve delay
    setTimeout(() => {
      setLoggingOut(false)
      sessionStorage.removeItem('rpsoft_logging_out')
    }, 1000)
  }

  return (
    <>
      {showAnimation && (
        <LogoutAnimation onComplete={handleAnimationComplete} />
      )}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {profileImageUrl ? (
              <img 
                key={`${imageKey}-${profileImageUrl}`}
                src={profileImageUrl}
                alt="Perfil" 
                className={styles.userAvatarImage}
                onError={(e) => {
                  // Si falla la carga, mostrar iniciales
                  e.target.style.display = 'none'
                  const parent = e.target.parentElement
                  if (parent && !parent.querySelector(`.${styles.userAvatarText}`)) {
                    const span = document.createElement('span')
                    span.className = styles.userAvatarText
                    span.textContent = userData?.full_name ? getInitials(userData.full_name) : 'U'
                    parent.appendChild(span)
                  }
                }}
              />
            ) : (
              <span className={styles.userAvatarText}>
                {userData?.full_name ? getInitials(userData.full_name) : 'U'}
              </span>
            )}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>
              {userData?.full_name || userData?.name || 'Usuario'}
            </p>
            <p className={styles.userEmail}>
              {userData?.email || 'Sin email'}
            </p>
            <p className={styles.userRole}>
              {(() => {
                // Priorizar role_id del backend
                if (userData?.role_id === 1) {
                  return 'Postulante'
                }
                if (userData?.role_id === 2) {
                  return 'Admin'
                }
                // Fallback a otros campos si no hay role_id
                return userData?.role_name || userData?.role || 'Usuario'
              })()}
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
