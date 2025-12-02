import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'

/**
 * Componente para proteger rutas solo para postulantes
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si tiene permisos
 */
export function RequirePostulante({ children }) {
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
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

    // Verificar si el usuario es postulante
    const userInfo = getUserInfo()
    if (!userInfo) {
      toast.error('Debes iniciar sesión para acceder a esta página')
      navigate('/seleccion-practicantes')
      return
    }

    const isPostulante = userInfo.role_id === 1 || userInfo.is_postulante === true || userInfo.role_slug === 'postulante'
    const isAdmin = userInfo.role_id === 2 || userInfo.is_admin === true || userInfo.role_slug === 'admin'
    
    if (!isPostulante || isAdmin) {
      toast.error('No tienes permisos para acceder a esta página')
      navigate('/seleccion-practicantes')
    }
  }, [navigate, toast])

  // Verificar antes de renderizar
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

  const isPostulante = userInfo.role_id === 1 || userInfo.is_postulante === true || userInfo.role_slug === 'postulante'
  const isAdmin = userInfo.role_id === 2 || userInfo.is_admin === true || userInfo.role_slug === 'admin'
  
  if (!isPostulante || isAdmin) {
    return null // No renderizar mientras redirige
  }

  return <>{children}</>
}

