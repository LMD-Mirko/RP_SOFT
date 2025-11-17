import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Eye,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  FileCheck,
} from 'lucide-react'
import clsx from 'clsx'
import styles from './Sidebar.module.css'
import { SidebarHeader } from '@shared/components/Layout/Sidebar/SidebarHeader/index.js'
import { SidebarFooter } from '@shared/components/Layout/Sidebar/SidebarFooter/index.js'
import { SidebarBackButton } from './SidebarBackButton'

const menuItems = [
  {
    title: 'CONVENIOS Y CONSTANCIAS',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/convenios-constancias',
      },
      {
        icon: Eye,
        label: 'Revision de Documentos',
        path: '/convenios-constancias/revision-documentos',
      },
      {
        icon: Shield,
        label: 'Auditoria',
        path: '/convenios-constancias/auditoria',
      },
      {
        icon: Settings,
        label: 'Configuracion',
        path: '/convenios-constancias/configuracion',
      },
    ],
  },
  {
    title: 'USUARIOS',
    items: [
      {
        icon: FileText,
        label: 'Convenios',
        path: '/convenios-constancias/usuario/convenio',
      },
      {
        icon: FileCheck,
        label: 'Constancias',
        path: '/convenios-constancias/usuario/constancias',
      },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState({
    'CONVENIOS Y CONSTANCIAS': true,
    'USUARIOS': true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    // Para dashboard: debe ser exactamente la ruta
    if (path === '/convenios-constancias') {
      return location.pathname === '/convenios-constancias' || location.pathname === '/convenios-constancias/'
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

