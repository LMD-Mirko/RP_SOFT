import { Share2, CheckCircle2, Gauge, Timer, Target, TrendingUp } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Avatar } from '../../../components/ui/Avatar'
import { Progress } from '../../../components/ui/Progress'
import { useMetrics } from '../../../hooks/useMetrics'

function TinyBarChart({ labels = [], values = [] }) {
  const max = Math.max(1, ...values)
  return (
    <div className="w-full h-48 flex items-end gap-3">
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-gray-100 rounded-md h-40 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 mx-1 rounded-md bg-black" style={{ height: `${(v / max) * 100}%` }} />
          </div>
          <div className="text-[11px] text-gray-500 truncate w-full text-center" title={labels[i]}>{labels[i]}</div>
        </div>
      ))}
    </div>
  )
}

function TinyLineChart({ labels = [], ideal = [], real = [] }) {
  // Simple placeholder: render two stacked progress-like bars per label
  const max = Math.max(1, ...ideal, ...real)
  return (
    <div className="w-full h-48 flex flex-col gap-2">
      {labels.map((lab, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-20 text-[11px] text-gray-500 truncate" title={lab}>{lab}</div>
          <div className="flex-1">
            <div className="h-2 rounded-full bg-gray-100 mb-1">
              <div className="h-2 rounded-full bg-gray-300" style={{ width: `${(ideal[i] / max) * 100}%` }} />
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-black" style={{ width: `${(real[i] / max) * 100}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function MetricsView() {
  const { loading, stats, velocity, burndown, team } = useMetrics()

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
        <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Métricas de Tareas</h1>
            <p className="text-gray-600">Análisis de desempeño y productividad del equipo</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Sprint Actual</Badge>
            <Button variant="light"><Share2 size={18} className="mr-2" /> Reportar</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Velocidad Promedio" value={stats.find(s=>s.id==='velocidad')?.valor + ' ' + (stats.find(s=>s.id==='velocidad')?.sufijo||'')} icon={Gauge} color="blue" />
          <Card title="Tasa de Completitud" value={stats.find(s=>s.id==='completitud')?.valor} icon={CheckCircle2} color="green" />
          <Card title="Tiempo Promedio" value={stats.find(s=>s.id==='tiempo')?.valor + ' ' + (stats.find(s=>s.id==='tiempo')?.sufijo||'')} icon={Timer} color="violet" />
          <Card title="Precisión de Estimación" value={stats.find(s=>s.id==='precision')?.valor} icon={Target} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Velocidad de equipo</div>
                <div className="text-xs text-gray-400">Puntos completados por sprint</div>
              </div>
              <TrendingUp size={18} className="text-gray-400" />
            </div>
            <TinyBarChart labels={velocity.labels} values={velocity.values} />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Burndown Chart</div>
                <div className="text-xs text-gray-400">Progreso del sprint real vs ideal</div>
              </div>
              <TrendingUp size={18} className="text-gray-400" />
            </div>
            <TinyLineChart labels={burndown.labels} ideal={burndown.ideal} real={burndown.real} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <div className="text-lg font-semibold text-gray-900">Desempeño del equipo</div>
            <div className="text-xs text-gray-500">Rendimiento individual en el sprint actual</div>
          </div>
          <div className="space-y-4">
            {team.map((m) => (
              <div key={m.id} className="">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar initials={m.iniciales} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="font-semibold text-gray-900">{m.nombre}</div>
                      <Badge variant="neutral">{m.rol}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">{m.tareas} tareas • {m.puntos} puntos <span className={m.tendencia.includes('-') ? 'text-rose-600' : 'text-emerald-600'}> {m.tendencia}</span></div>
                  </div>
                </div>
                <Progress value={m.progreso} max={100} color={m.tendencia.includes('-') ? 'orange' : 'green'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
