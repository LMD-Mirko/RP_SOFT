import { Bell } from 'lucide-react'

export function NotificationBell({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Notificaciones"
      style={{
        border: '1px solid #e5e7eb',
        background: '#fff',
        width: 28,
        height: 28,
        borderRadius: 6,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Bell size={16} />
    </button>
  )
}