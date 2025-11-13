import { useLocation, useNavigate } from 'react-router-dom'
import { MessageSquare, Users, Download, LayoutGrid } from 'lucide-react'
import styles from './Sidebar.module.css'
import { SidebarBackButton } from './SidebarBackButton'

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { icon: MessageSquare, label: 'Daily Scrum', path: '/transcripcion-reuniones/daily-scrum' },
    { icon: Users, label: 'Scrum de Scrum', path: '/transcripcion-reuniones/scrum-scrum' },
    { icon: LayoutGrid, label: 'Panel Central', path: '/transcripcion-reuniones/panel-central' },
    { icon: MessageSquare, label: 'Transcripciones', path: '/transcripcion-reuniones/transcripciones' },
  ]

  return (
    <aside className={styles.container}>
      <SidebarBackButton />
      <div className={styles.content}>
        <div className={styles.sectionTitle}>TRANSCRIPCIÓN</div>
        {items.map(({ icon: Icon, label, path }) => {
          const active = location.pathname.startsWith(path)
          return (
            <button
              key={path}
              className={`${styles.item} ${active ? styles.itemActive : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon className={styles.itemIcon} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      <div className={styles.footer}>Transcripción Reuniones</div>
    </aside>
  )
}