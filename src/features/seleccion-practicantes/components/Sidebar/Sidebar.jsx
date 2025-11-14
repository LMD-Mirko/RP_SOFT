import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  FolderOpen,
  FileText,
  CheckCircle,
  Clock,
  Settings,
  User,
  Users,
  Shield,
  GraduationCap,
  FileType,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import clsx from 'clsx'
import styles from './Sidebar.module.css'
import { SidebarHeader } from '@shared/components/Layout/Sidebar/SidebarHeader/index.js'
import { SidebarFooter } from '@shared/components/Layout/Sidebar/SidebarFooter/index.js'
import { SidebarBackButton } from './SidebarBackButton'

const menuItems = [
  {
    title: 'PRINCIPAL',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/seleccion-practicantes',
      },
    ],
  },
  {
    title: 'RECLUTAMIENTO',
    items: [
      {
        icon: Calendar,
        label: 'Convocatorias',
        path: '/seleccion-practicantes/convocatorias',
      },
      {
        icon: FolderOpen,
        label: 'Postulantes',
        path: '/seleccion-practicantes/postulantes',
      },
      {
        icon: FileText,
        label: 'Ver CV/s',
        path: '/seleccion-practicantes/cvs',
      },
    ],
  },
  {
    title: 'GESTIÓN',
    items: [
      {
        icon: CheckCircle,
        label: 'Evaluaciones',
        path: '/seleccion-practicantes/evaluaciones',
      },
      {
        icon: Calendar,
        label: 'Calendario',
        path: '/seleccion-practicantes/calendario',
      },
      {
        icon: Clock,
        label: 'Historial',
        path: '/seleccion-practicantes/historial',
      },
      {
        icon: Users,
        label: 'Usuarios',
        path: '/seleccion-practicantes/usuarios',
        adminOnly: true, // Solo visible para administradores
      },
      {
        icon: Shield,
        label: 'Roles',
        path: '/seleccion-practicantes/roles',
        adminOnly: true, // Solo visible para administradores
      },
      {
        icon: GraduationCap,
        label: 'Especialidades',
        path: '/seleccion-practicantes/especialidades',
        adminOnly: true, // Solo visible para administradores
      },
      {
        icon: FileType,
        label: 'Tipos de Documento',
        path: '/seleccion-practicantes/tipos-documento',
        adminOnly: true, // Solo visible para administradores
      },
    ],
  },
  {
    title: 'CUENTA',
    items: [
      {
        icon: User,
        label: 'Mi Perfil',
        path: '/seleccion-practicantes/perfil',
      },
      {
        icon: Settings,
        label: 'Configuración',
        path: '/seleccion-practicantes/configuracion',
      },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    PRINCIPAL: true,
    RECLUTAMIENTO: true,
    GESTIÓN: true,
    CUENTA: true,
  })

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
  const isAdmin = () => {
    const userInfo = getUserInfo()
    if (!userInfo) return false
    // Verificar por role_id (2 = Admin) o por is_admin
    return userInfo.role_id === 2 || userInfo.is_admin === true || userInfo.role_slug === 'admin'
  }

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    // Para dashboard: debe ser exactamente la ruta
    if (path === '/seleccion-practicantes') {
      return location.pathname === '/seleccion-practicantes' || location.pathname === '/seleccion-practicantes/'
    }
    // Para otras rutas: debe empezar con la ruta y tener algo más o ser exactamente igual
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  // Filtrar items según permisos
  const filterMenuItems = () => {
    const userIsAdmin = isAdmin()
    return menuItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // Si el item requiere admin y el usuario no es admin, ocultarlo
        if (item.adminOnly && !userIsAdmin) {
          return false
        }
        return true
      }),
    })).filter((section) => section.items.length > 0) // Eliminar secciones vacías
  }

  const filteredMenuItems = filterMenuItems()

  return (
    <div className={styles.sidebar}>
      <SidebarHeader />
      <SidebarBackButton />

      <nav className={styles.nav}>
        {filteredMenuItems.map((section) => (
          <div key={section.title} className={styles.section}>
            <button
              onClick={() => toggleSection(section.title)}
              className={styles.sectionButton}
            >
              <span>{section.title}</span>
              {expandedSections[section.title] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {expandedSections[section.title] && (
              <div className={styles.sectionItems}>
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)

                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={clsx(styles.menuItem, active && styles.active)}
                    >
                      <Icon size={20} className={styles.menuIcon} />
                      <span className={styles.menuLabel}>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      <SidebarFooter />
    </div>
  )
}
