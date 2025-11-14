import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Target, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import styles from './SidebarUsuario.module.css'
import { SidebarHeader } from '@shared/components/Layout/Sidebar/SidebarHeader/index.js'
import { SidebarFooter } from '@shared/components/Layout/Sidebar/SidebarFooter/index.js'
import { SidebarBackButton } from '../Sidebar/SidebarBackButton'

const menuItems = [
  {
    title: 'EVALUACIONES',
    items: [
      {
        icon: Target,
        label: 'Evaluación 360°',
        path: '/evaluacion-360/usuario/evaluacion-360',
      },
      {
        icon: FileText,
        label: 'Notas',
        path: '/evaluacion-360/usuario/notas',
        submenu: [
          {
            label: 'Nota 360',
            path: '/evaluacion-360/usuario/nota-360',
          },
          {
            label: 'Nota Técnica',
            path: '/evaluacion-360/usuario/nota-tecnica',
          },
        ],
      },
    ],
  },
]

export function SidebarUsuario() {
  const location = useLocation()
  const navigate = useNavigate()

  const [expandedSections, setExpandedSections] = useState({
    EVALUACIONES: true,
  })

  const [expandedSubmenus, setExpandedSubmenus] = useState({})

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const toggleSubmenu = (label) => {
    setExpandedSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  // 🔥 EXACT matches only when strict=true
  const isActive = (path, strict = false) => {
    if (strict) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  // 🔥 Abre automáticamente el submenú "Notas" cuando entras a una de sus rutas
  useEffect(() => {
    if (location.pathname.includes('/evaluacion-360/usuario/notas/')) {
      setExpandedSubmenus((prev) => ({
        ...prev,
        Notas: true,
      }))
    }
  }, [location.pathname])

  return (
    <div className={styles.sidebar}>
      <SidebarHeader />
      <SidebarBackButton />

      <nav className={styles.nav}>
        <div className={styles.viewSwitcher}>
          <button
            onClick={() => navigate('/evaluacion-360/eventos-evaluacion')}
            className={styles.switchButton}
          >
            <Target size={16} />
            <span>Vista de Admin</span>
          </button>
        </div>

        {menuItems.map((section) => (
          <div key={section.title} className={styles.section}>
            
            {/* TÍTULO DEL BLOQUE */}
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
                  const hasSubmenu = !!item.submenu

                  // 🔥 Notas solo activa con match EXACTO (nunca en subrutas)
                  const active = isActive(item.path, true)

                  return (
                    <div key={item.path} className={styles.menuGroup}>
                      
                      {/* BOTÓN PRINCIPAL */}
                      <button
                        onClick={() =>
                          hasSubmenu
                            ? toggleSubmenu(item.label)
                            : navigate(item.path)
                        }
                        className={clsx(styles.menuItem, active && styles.active)}
                      >
                        <Icon size={20} className={styles.menuIcon} />
                        <span className={styles.menuLabel}>{item.label}</span>

                        {hasSubmenu &&
                          (expandedSubmenus[item.label] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          ))}
                      </button>

                      {/* SUBMENÚ */}
                      {hasSubmenu && expandedSubmenus[item.label] && (
                        <div className={styles.submenu}>
                          {item.submenu.map((sub) => {
                            const activeSub = location.pathname === sub.path

                            return (
                              <button
                                key={sub.path}
                                onClick={() => navigate(sub.path)}
                                className={clsx(
                                  styles.submenuItem,
                                  activeSub && styles.active
                                )}
                              >
                                {sub.label}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
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
