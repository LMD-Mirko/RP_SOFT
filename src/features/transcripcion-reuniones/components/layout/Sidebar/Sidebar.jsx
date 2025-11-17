import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Users,
  LayoutGrid,
  FileText,
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
    title: 'TRANSCRIPCIÓN',
    items: [
      {
        icon: MessageSquare,
        label: 'Daily Scrum',
        path: '/transcripcion-reuniones/daily-scrum',
      },
      {
        icon: Users,
        label: 'Scrum de Scrum',
        path: '/transcripcion-reuniones/scrum-scrum',
      },
      {
        icon: LayoutGrid,
        label: 'Panel Central',
        path: '/transcripcion-reuniones/panel-central',
      },
      {
        icon: FileText,
        label: 'Transcripciones',
        path: '/transcripcion-reuniones/transcripciones',
      },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    TRANSCRIPCIÓN: true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    if (path === '/transcripcion-reuniones') {
      return (
        location.pathname === '/transcripcion-reuniones' ||
        location.pathname === '/transcripcion-reuniones/'
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