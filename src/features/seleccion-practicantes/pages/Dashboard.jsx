import { DashboardPage } from '../modules/dashboard/pages'
import { DashboardPostulantePage } from '../modules/dashboard/pages/DashboardPostulantePage'
import { RequireRole } from '../routes/RequireRole'
import { RequirePostulante } from '../routes/RequirePostulante'

/**
 * Obtiene información del usuario desde localStorage
 */
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

/**
 * Verifica si el usuario es administrador
 */
const isAdmin = () => {
  const userInfo = getUserInfo()
  if (!userInfo) return false
  return userInfo.role_id === 2 || userInfo.is_admin === true || userInfo.role_slug === 'admin'
}

/**
 * Verifica si el usuario es postulante
 */
const isPostulante = () => {
  const userInfo = getUserInfo()
  if (!userInfo) return false
  return userInfo.role_id === 1 || userInfo.is_postulante === true || userInfo.role_slug === 'postulante'
}

export function Dashboard() {
  const userIsAdmin = isAdmin()
  const userIsPostulante = isPostulante()

  // Si es admin, mostrar dashboard de admin
  if (userIsAdmin) {
    return (
      <RequireRole requireAdmin={true}>
        <DashboardPage />
      </RequireRole>
    )
  }

  // Si es postulante, mostrar dashboard de postulante
  if (userIsPostulante) {
    return (
      <RequirePostulante>
        <DashboardPostulantePage />
      </RequirePostulante>
    )
  }

  // Por defecto, mostrar dashboard de admin (requiere autenticación)
  return (
    <RequireRole requireAdmin={true}>
      <DashboardPage />
    </RequireRole>
  )
}

