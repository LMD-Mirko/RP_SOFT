import { Plus, Share2, Ellipsis, Timer, Gauge, Users as UsersIcon, CheckCircle2 } from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Avatar } from '../../../components/ui/Avatar'
import { Progress } from '../../../components/ui/Progress'
import { useSprintBoard } from '../../../hooks/useSprintBoard'

function ColumnCard({ card }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {card.tags?.map((t) => (
          <Badge key={t} variant={t.includes('Prioridad') ? 'warning' : t.includes('Seguridad') ? 'purple' : t.includes('Back') ? 'neutral' : t.includes('Front') ? 'info' : 'success'}>{t}</Badge>
        ))}
      </div>
      <h4 className="text-[15px] leading-5 font-semibold text-gray-900 mb-3">{card.id} - {card.titulo}</h4>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> {card.puntos} pts</span>
        <span className="inline-flex items-center gap-2"><Avatar initials={card.owner} /></span>
      </div>
      <div className="mt-3">
        <Progress value={card.progreso?.done || 0} max={card.progreso?.total || 1} color="violet" />
        <div className="mt-1 text-xs text-gray-500">{card.progreso?.done ?? 0}/{card.progreso?.total ?? 0}</div>
      </div>
    </div>
  )
}

function Column({ column }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
        <h3 className="text-sm font-semibold text-gray-700">{column.titulo}</h3>
        <button className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600"><Ellipsis size={18} /></button>
      </div>
      <div className="space-y-[15px]">
        {column.cards.map((c) => (
          <ColumnCard key={c.id + c.titulo} card={c} />
        ))}
        <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          <Plus size={18} /> Añadir Tarjeta
        </button>
      </div>
    </div>
  )
}

export function SprintBoard() {
  const { loading, stats, columns, members } = useSprintBoard()

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight">Sprint Board</h1>
              <Badge variant="success">{stats.estado}</Badge>
            </div>
            <p className="text-gray-600">{stats.nombre}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex -space-x-2">
              {members.map((m) => (
                <Avatar key={m.id} initials={m.iniciales} color={m.color} className="ring-2 ring-white" />
              ))}
              <Button variant="light" className="h-8 px-3">+</Button>
            </div>
            <Button variant="light"><Share2 size={18} className="mr-2" /> Compartir</Button>
            <Button variant="dark"><Plus size={18} className="mr-2" /> Agregar Tarea</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Duración" value={stats.duracion} icon={Timer} color="gray" />
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm text-gray-500">Puntos del Sprint</div>
                <div className="mt-1 text-2xl font-semibold text-rose-600">{stats.puntosHechos}/{stats.puntosTotales}</div>
              </div>
            </div>
            <Progress value={stats.puntosHechos} max={stats.puntosTotales} color="orange" />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">Velocidad</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-600 flex items-center gap-2"><Gauge size={20} /> {stats.velocidad} pts/día</div>
            <div className="text-xs text-emerald-600">{stats.tendencia}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">Equipo</div>
            <div className="mt-1 text-2xl font-semibold text-violet-600 flex items-center gap-2"><UsersIcon size={20} /> {stats.equipo} miembros</div>
            <div className="text-xs text-gray-500">Todos activos</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => (
            <div key={col.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <Column column={col} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
