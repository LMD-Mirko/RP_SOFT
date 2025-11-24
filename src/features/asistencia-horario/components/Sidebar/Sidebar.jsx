import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bot,
  Clock,
  Users,
  Calendar,
  BarChart2,
  AlertCircle,
  ClipboardList,
  UserCheck,
  CalendarDays,
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
    title: 'MONITOREO',
    items: [
      {
        icon: Bot,
        label: 'Bot & Integración',
        path: '/asistencia-horario/bot-integracion',
        badge: 'Activo',
      },
    ],
  },
  {
    title: 'ASISTENCIA',
    items: [
      {
        icon: Clock,
        label: 'Puntualidad',
        path: '/asistencia-horario/puntualidad',
      },
      {
        icon: Users,
        label: 'Practicantes',
        path: '/asistencia-horario/practicantes',
      },
      {
        icon: Calendar,
        label: 'Gestion de horarios',
        path: '/asistencia-horario/gestion-horarios',
      },
    ],
  },
  {
    title: 'MÓDULOS',
    items: [
      {
        icon: BarChart2,
        label: 'Reportes',
        path: '/asistencia-horario/reportes',
      },
      {
        icon: ClipboardList,
        label: 'Historial de Practicantes',
        path: '/asistencia-horario/historial-practicantes',
      },
    ],
  },
  {
    title: 'PRACTICANTE',
    items: [
      {
        icon: Clock,
        label: 'Inicio',
        path: '/asistencia-horario/practicante/inicio',
      },
      {
        icon: UserCheck,
        label: 'Mi Asistencia',
        path: '/asistencia-horario/practicante/mi-asistencia',
      },
      {
        icon: CalendarDays,
        label: 'Mi Horario',
        path: '/asistencia-horario/practicante/mi-horario',
      },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    MONITOREO: true,
    ASISTENCIA: true,
    MÓDULOS: true,
    PRACTICANTE: true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    // Para dashboard: debe ser exactamente la ruta
    if (path === '/asistencia-horario') {
      return location.pathname === '/asistencia-horario' || location.pathname === '/asistencia-horario/'
    }
    // Para otras rutas: debe empezar con la ruta y tener algo más o ser exactamente igual
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className={styles.sidebar}>
      <SidebarHeader />
      <SidebarBackButton />

      <nav className={styles.nav}>
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
                      {item.badge && (
                        <span className={styles.badge}>{item.badge}</span>
                      )}
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

