import { Search, Upload, Download, Plus, CheckCircle2, BadgeInfo, Timer, Hash, User as UserIcon, ChevronDown } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { useBacklogPanel } from '../../../hooks/useBacklogPanel'

export function BacklogPanel() {
  const {
    loading,
    stories,
    priorities,
    states,
    query,
    setQuery,
    priority,
    setPriority,
    state,
    setState,
    stats,
  } = useBacklogPanel()

  const priorityBadge = (p) => {
    if (p === 'Crítica') return { variant: 'danger', label: 'Crítica' }
    if (p === 'Alta') return { variant: 'warning', label: 'Alta' }
    if (p === 'Media') return { variant: 'info', label: 'Media' }
    if (p === 'Baja') return { variant: 'neutral', label: 'Baja' }
    return { variant: 'neutral', label: p }
  }

  const stateBadge = (s) => {
    if (s === 'Lista') return { variant: 'success', label: 'Lista' }
    if (s === 'En revisión') return { variant: 'purple', label: 'En revisión' }
    return { variant: 'neutral', label: s }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Backlog del Producto</h1>
            <p className="text-gray-600">Gestiona y prioriza las historias de usuario del proyecto</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="light"><Upload size={18} className="mr-2" /> Importar</Button>
            <Button variant="light"><Download size={18} className="mr-2" /> Exportar</Button>
            <Button variant="dark"><Plus size={18} className="mr-2" /> Nueva Historia</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Total Historias" value={stats.total} icon={BadgeInfo} color="orange" />
          <Card title="Puntos Estimados" value={stats.puntos} icon={Hash} color="blue" />
          <Card title="Listas para Sprint" value={stats.listasSprint} icon={CheckCircle2} color="green" />
          <Card title="Sin Estimar" value={stats.sinEstimar} icon={Timer} color="violet" />
        </div>

        <div className="mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Input
                  className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm pl-10"
                  placeholder="Buscar por ID, título o descripción..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="relative">
                <Select
                  className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="relative">
                <Select
                  className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-[15px]">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
          ) : stories.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">No hay historias</div>
          ) : (
            stories.map((st) => {
              const pb = priorityBadge(st.prioridad)
              const sb = stateBadge(st.estado)
              return (
                <div key={st.id} className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 mr-2">{st.id}</span>
                      <Badge variant={pb.variant}>{pb.label}</Badge>
                      <Badge variant={sb.variant}>{sb.label}</Badge>
                      {st.etiqueta && <Badge variant="pink">{st.etiqueta}</Badge>}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{st.titulo}</h3>
                      <p className="text-sm text-gray-600 mt-1">{st.descripcion}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2"><Hash size={16} /> {st.puntos ?? 0} Puntos</span>
                      <span className="inline-flex items-center gap-2"><UserIcon size={16} /> {st.autor}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
