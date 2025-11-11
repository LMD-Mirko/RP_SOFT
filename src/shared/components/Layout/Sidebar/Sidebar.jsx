import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Mic,
  ClipboardList,
  ClockCheck,
  Target,
  Database,
  Bot,
  FileCheck,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import clsx from 'clsx'
import styles from './Sidebar.module.css'
import { SidebarHeader } from './SidebarHeader/index.js'
import { SidebarFooter } from './SidebarFooter/index.js'

const menuItems = [
  {
    title: 'PRINCIPAL',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/dashboard',
      },
    ],
  },
  {
    title: 'GESTIÓN DE MODULOS',
    items: [
      {
        icon: Users,
        label: 'Selección Practicantes',
        path: '/seleccion-practicantes',
      },
      {
        icon: Mic,
        label: 'Transcripción Reuniones',
        path: '/transcripcion-reuniones',
      },
      {
        icon: ClipboardList,
        label: 'Gestión Tareas',
        path: '/gestion-tareas',
      },
      {
        icon: ClockCheck,
        label: 'Asistencia & Horario',
        path: '/asistencia-horario',
      },
      {
        icon: Target,
        label: 'Evaluación 360',
        path: '/evaluacion-360',
      },
      {
        icon: Database,
        label: 'Dataset Transcripción',
        path: '/dataset-transcripcion',
      },
      {
        icon: Bot,
        label: 'Agente Integrador',
        path: '/agente-integrador',
      },
      {
        icon: FileCheck,
        label: 'Convenios Constancias',
        path: '/convenios-constancias',
      },
    ],
  },
  {
    title: 'CUENTA',
    items: [
      {
        icon: Settings,
        label: 'Configuración',
        path: '/configuracion',
      },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    PRINCIPAL: true,
    'GESTIÓN DE MODULOS': true,
    CUENTA: true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path) && location.pathname !== '/'
  }

  return (
    <div className={styles.sidebar}>
      <SidebarHeader />

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
