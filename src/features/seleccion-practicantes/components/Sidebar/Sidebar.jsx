import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  FolderOpen,
  FileText,
  CheckCircle,
  Clock,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Download,
  Award,
  Users,
  BookOpen,
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
    title: 'POSTULANTE',
    items: [
      {
        icon: FileText,
        label: 'Ver CV/s',
        path: '/seleccion-practicantes/cvs',
        postulanteOnly: true, // Solo Postulante (Admin NO puede ver)
      },
      {
        icon: Award,
        label: 'Mis Evaluaciones',
        path: '/seleccion-practicantes/evaluaciones/mis-evaluaciones',
        postulanteOnly: true, // Solo Postulante (Admin NO puede ver)
      },
    ],
  },
  {
    title: 'EXÁMENES',
    items: [
      {
        icon: BookOpen,
        label: 'Exámenes asignados',
        path: '/seleccion-practicantes/examenes/asignados',
        exact: true,
      },
      {
        icon: BookOpen,
        label: 'Gestión de Exámenes',
        path: '/seleccion-practicantes/examenes',
        adminOnly: true,
        excludePaths: ['/seleccion-practicantes/examenes/asignados'],
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
        adminOnly: true, // Solo Admin
      },
      {
        icon: FolderOpen,
        label: 'Postulantes',
        path: '/seleccion-practicantes/postulantes',
        adminOnly: true, // Solo Admin
      },
    ],
  },
  {
    title: 'GESTIÓN',
    items: [
      {
        icon: CheckCircle,
        label: 'Evaluaciones Técnicas',
        path: '/seleccion-practicantes/evaluaciones',
        adminOnly: true,
      },
      {
        icon: Users,
        label: 'Gestión de Reuniones',
        path: '/seleccion-practicantes/calendario',
        adminOnly: true, // Solo Admin (Postulante NO puede ver)
      },
      {
        icon: Download,
        label: 'Gestión de CVs',
        path: '/seleccion-practicantes/cvs-admin',
        adminOnly: true, // Solo visible para administradores
      },
      {
        icon: GraduationCap,
        label: 'Especialidades',
        path: '/seleccion-practicantes/especialidades',
        adminOnly: true, // Solo visible para administradores
      },
      {
        icon: Clock,
        label: 'Historial',
        path: '/seleccion-practicantes/historial',
        adminOnly: true, // Solo Admin (Postulante NO puede ver)
      },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    PRINCIPAL: true,
    POSTULANTE: true,
    RECLUTAMIENTO: true,
    EXÁMENES: true,
    GESTIÓN: true,
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

  // Verificar si el usuario es postulante
  const isPostulante = () => {
    const userInfo = getUserInfo()
    if (!userInfo) return false
    // Verificar por role_id (1 = Postulante) o por is_postulante
    return userInfo.role_id === 1 || userInfo.is_postulante === true || userInfo.role_slug === 'postulante'
  }

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

const isActive = (path, { exact = false, excludePaths = [] } = {}) => {
    if (path === '/seleccion-practicantes') {
      return (
        location.pathname === '/seleccion-practicantes' ||
        location.pathname === '/seleccion-practicantes/'
      )
    }
  if (exact) {
    return location.pathname === path
  }
  const matches =
    location.pathname === path || location.pathname.startsWith(path + '/')

  if (!matches) return false

  if (excludePaths.some((excludedPath) => location.pathname.startsWith(excludedPath))) {
    return false
  }

  return true
  }

  // Filtrar items según permisos
  const filterMenuItems = () => {
    const userIsAdmin = isAdmin()
    const userIsPostulante = isPostulante()
    
    return menuItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // Si el item requiere admin y el usuario no es admin, ocultarlo
        if (item.adminOnly && !userIsAdmin) {
          return false
        }
        // Si el item es solo para postulantes y el usuario no es postulante, ocultarlo
        if (item.postulanteOnly && !userIsPostulante) {
          return false
        }
        // Si el item es solo para postulantes y el usuario es admin, ocultarlo (Admin NO puede ver)
        if (item.postulanteOnly && userIsAdmin) {
          return false
        }
        // Si el item requiere admin y el usuario es postulante, ocultarlo
        if (item.adminOnly && userIsPostulante) {
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
                  const active = isActive(item.path, {
                    exact: item.exact,
                    excludePaths: item.excludePaths || [],
                  })

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
