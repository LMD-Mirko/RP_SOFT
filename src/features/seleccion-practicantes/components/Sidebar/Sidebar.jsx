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
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Users,
  Download,
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
    ],
  },

  // 🔹 NUEVA SECCIÓN: TRANSCRIPCIÓN
  {
    title: 'TRANSCRIPCIÓN',
    items: [
      {
        icon: MessageSquare,
        label: 'Daily Scrum',
        path: '/seleccion-practicantes/daily-scrum',
      },
      {
        icon: Users,
        label: 'Scrum de Scrum',
        path: '/seleccion-practicantes/scrum-scrum',
      },
      {
        icon: Download,
        label: 'Transcripciones',
        path: '/seleccion-practicantes/transcripciones',
      },
    ],
  },

  {
    title: 'CUENTA',
    items: [
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
    TRANSCRIPCIÓN: true,
    CUENTA: true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    if (path === '/seleccion-practicantes') {
      return (
        location.pathname === '/seleccion-practicantes' ||
        location.pathname === '/seleccion-practicantes/'
      )
    }
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
