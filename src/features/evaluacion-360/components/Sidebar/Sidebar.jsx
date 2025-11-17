import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Target,
  User,
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
    title: 'EVALUACIONES',
    items: [
      {
        icon: Calendar,
        label: 'Eventos de Evaluación',
        path: '/evaluacion-360/eventos-evaluacion',
      },
      {
        icon: Target,
        label: 'Evaluación 360°',
        path: '/evaluacion-360/evaluacion-360',
      },
      {
        icon: User,
        label: 'Evaluación Técnica',
        path: '/evaluacion-360/evaluacion-tecnica',
      },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    EVALUACIONES: true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    // Para la ruta index: debe ser exactamente la ruta o eventos-evaluacion
    if (path === '/evaluacion-360/eventos-evaluacion') {
      return location.pathname === '/evaluacion-360' || 
             location.pathname === '/evaluacion-360/' || 
             location.pathname === '/evaluacion-360/eventos-evaluacion'
    }
    // Para otras rutas: debe empezar con la ruta y tener algo más o ser exactamente igual
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className={styles.sidebar}>
      <SidebarHeader />
      <SidebarBackButton />

      <nav className={styles.nav}>
        {/* Botón para cambiar a vista de usuario */}
        <div className={styles.viewSwitcher}>
          <button
            onClick={() => navigate('/evaluacion-360/usuario/evaluacion-360')}
            className={styles.switchButton}
          >
            <User size={16} />
            <span>Vista de Usuario</span>
          </button>
        </div>

        {menuItems.map((section) => (
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
