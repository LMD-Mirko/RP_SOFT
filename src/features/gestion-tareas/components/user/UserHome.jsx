import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { useUserHome } from '../../hooks/useUserHome'

function MiniLine({ labels = [], values = [] }) {
  const max = Math.max(1, ...values)
  // Simple SVG line
  const points = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * 100
    const y = 100 - (v / max) * 100
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" className="w-full h-48">
      <polyline fill="none" stroke="black" strokeWidth="2" points={points} />
    </svg>
  )
}

export function UserHome() {
  const { loading, summary, series, tasks } = useUserHome()

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Tareas Completadas" value={summary.completadas} color="green" />
        <Card title="Tareas Pendientes" value={summary.pendientes} color="orange" />
        <Card title="Progreso" value={`${summary.progreso}%`} color="blue" />
        <Card title="Tu Rol" value={summary.rol} color="violet" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500">Mi Mentor</div>
          <div className="text-xs text-gray-600 inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> {summary.mentor.estado}</div>
        </div>
        <div className="flex items-start gap-3">
          <Avatar initials={summary.mentor.nombre.split(' ').map(s=>s[0]).slice(0,2).join('')} />
          <div>
            <div className="font-semibold text-gray-900">{summary.mentor.nombre}</div>
            <div className="text-xs text-gray-500">{summary.mentor.cargo}</div>
            <div className="text-xs text-gray-500">{summary.mentor.correo}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-gray-500 mb-3">Mi Progreso</div>
        <MiniLine labels={series.labels} values={series.values} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-lg font-semibold text-gray-900 mb-3">Mis Tareas Urgentes</div>
        <div className="space-y-4">
          {tasks.map((t) => (
            <div key={t.id} className="border-t first:border-t-0 border-gray-100 pt-4 first:pt-0">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-gray-900">{t.titulo}</div>
                <Badge variant={t.etiqueta === 'Alto' ? 'danger' : 'warning'}>{t.etiqueta}</Badge>
              </div>
              <div className="text-sm text-gray-600">{t.descripcion}</div>
              <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-2">{t.fecha}</span>
                <Badge variant={t.estado === 'En Proceso' ? 'info' : 'neutral'}>{t.estado}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
