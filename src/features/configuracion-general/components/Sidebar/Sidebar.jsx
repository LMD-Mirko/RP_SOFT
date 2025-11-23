import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Settings,
  Users,
  Shield,
  GraduationCap,
  FileType,
  User,
  ChevronDown,
  ChevronRight,
  Key,
} from 'lucide-react'
import clsx from 'clsx'
import styles from './Sidebar.module.css'
import { SidebarHeader } from '@shared/components/Layout/Sidebar/SidebarHeader/index.js'
import { SidebarFooter } from '@shared/components/Layout/Sidebar/SidebarFooter/index.js'
import { SidebarBackButton } from './SidebarBackButton'

// Opciones específicas para configuración global
const configMenuItems = [
  {
    title: 'CONFIGURACIÓN GLOBAL',
    items: [
      {
        icon: Settings,
        label: 'General',
        path: '/configuracion/global/general',
        adminOnly: true,
      },
      {
        icon: Key,
        label: 'Variables de Entorno',
        path: '/configuracion/global/variables-entorno',
        adminOnly: true,
      },
      {
        icon: Users,
        label: 'Gestión de Usuarios',
        path: '/configuracion/global/usuarios',
        adminOnly: true,
      },
      {
        icon: Shield,
        label: 'Roles',
        path: '/configuracion/global/roles',
        adminOnly: true,
      },
      {
        icon: GraduationCap,
        label: 'Especialidades',
        path: '/configuracion/global/especialidades',
        adminOnly: true,
      },
      {
        icon: FileType,
        label: 'Tipos de Documento',
        path: '/configuracion/global/tipos-documento',
        adminOnly: true,
      }
    ],
  },
  {
    title: 'CUENTA',
    items: [
      {
        icon: User,
        label: 'Mi Perfil',
        path: '/configuracion/global/perfil'
      }
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    'CONFIGURACIÓN GLOBAL': true,
    CUENTA: true
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
    return userInfo.role_id === 2 || userInfo.is_admin === true || userInfo.role_slug === 'admin'
  }

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  // Filtrar items según permisos
  const filterMenuItems = () => {
    const userIsAdmin = isAdmin()
    return configMenuItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.adminOnly && !userIsAdmin) {
          return false
        }
        return true
      }),
    })).filter((section) => section.items.length > 0)
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
