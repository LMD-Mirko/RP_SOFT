import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'

/**
 * Componente para proteger rutas según el rol del usuario
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si tiene permisos
 * @param {boolean} props.requireAdmin - Si es true, solo permite acceso a administradores
 */
export function RequireRole({ children, requireAdmin = false }) {
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (requireAdmin) {
      // Obtener información del usuario desde localStorage
      const getUserInfo = () => {
        try {
          const userData = localStorage.getItem('rpsoft_user')
          if (userData) {
            return JSON.parse(userData)
          }
        } catch (error) {
          console.error('Error al obtener información del usuario:', error)
        }
        return null
      }

      // Verificar si el usuario es administrador
      const userInfo = getUserInfo()
      if (!userInfo) {
        toast.error('Debes iniciar sesión para acceder a esta página')
        navigate('/seleccion-practicantes')
        return
      }

      const isAdmin = userInfo.role_id === 2 || userInfo.is_admin === true || userInfo.role_slug === 'admin'
      
      if (!isAdmin) {
        toast.error('No tienes permisos para acceder a esta página')
        navigate('/seleccion-practicantes')
      }
    }
  }, [requireAdmin, navigate, toast])

  // Si requiere admin, verificar antes de renderizar
  if (requireAdmin) {
    const getUserInfo = () => {
      try {
        const userData = localStorage.getItem('rpsoft_user')
        if (userData) {
          return JSON.parse(userData)
        }
      } catch (error) {
        return null
      }
      return null
    }

    const userInfo = getUserInfo()
    if (!userInfo) {
      return null // No renderizar mientras redirige
    }

    const isAdmin = userInfo.role_id === 2 || userInfo.is_admin === true || userInfo.role_slug === 'admin'
    
    if (!isAdmin) {
      return null // No renderizar mientras redirige
    }
  }

  return <>{children}</>
}

