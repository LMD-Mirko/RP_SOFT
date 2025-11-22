import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Mic,
  ClipboardList,
  ClockCheck,
  Target,
  Bot,
  FileCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  QrCode,
  ArrowUpRight,
  Database,
} from 'lucide-react'
import clsx from 'clsx'
import styles from './Sidebar.module.css'
import { SidebarHeader } from './SidebarHeader/index.js'
import { SidebarFooter } from './SidebarFooter/index.js'
import { useChatPanel } from '@shared/context/ChatPanelContext'
import { QRGeneratorModal } from '@shared/components/ChatPanel/QRGeneratorModal/QRGeneratorModal'

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
    title: 'HERRAMIENTAS',
    items: [
      {
        icon: QrCode,
        label: 'Generador QR',
        path: '/generador-qr',
      },
      {
        icon: Database,
        label: 'Sistema Datasets',
        path: '/sistema-datasets',
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
  const { toggleChat, isOpen: isChatOpen } = useChatPanel()
  const [showQRModal, setShowQRModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    PRINCIPAL: true,
    'GESTIÓN DE MODULOS': true,
    HERRAMIENTAS: true,
    CUENTA: true,
  })

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (path) => {
    // Si el chat está abierto, solo Agente Integrador debe estar activo
    if (isChatOpen) {
      return path === '/agente-integrador'
    }

    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }

    if (path === '/agente-integrador') {
      return false
    }

    // Generador QR no debe marcarse como activo (solo abre un modal)
    if (path === '/generador-qr') {
      return false
    }

    if (path === '/') {
      return (location.pathname === '/' || location.pathname === '') && !isChatOpen
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
                  const isAgenteIntegrador = item.path === '/agente-integrador'
                  const isGeneradorQR = item.path === '/generador-qr'
                  const isSistemaDatasets = item.path === '/sistema-datasets'

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        if (isAgenteIntegrador) {
                          toggleChat()
                        } else if (isGeneradorQR) {
                          setShowQRModal(true)
                        } else {
                          navigate(item.path)
                        }
                      }}
                      className={clsx(styles.menuItem, active && styles.active, isSistemaDatasets && styles.datasetsItem)}
                    >
                      <Icon size={20} className={styles.menuIcon} />
                      <span className={styles.menuLabel}>{item.label}</span>
                      {isSistemaDatasets && (
                        <ArrowUpRight size={16} className={styles.arrowIcon} />
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

      <QRGeneratorModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  )
}
