import { Upload, Plus, Star, FolderOpen, TrendingUp, Tags, Search, ChevronDown, Copy } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Badge } from '../ui/Badge'
import { useHistoryRepo } from '../../hooks/useHistoryRepo'

function TemplateCard({ tpl }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-semibold text-gray-500">{tpl.code}</div>
        <button className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600">⋯</button>
      </div>
      <div className="flex items-center gap-1 text-amber-500 mb-2">
        {Array.from({ length: tpl.stars || 0 }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{tpl.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tpl.desc}</p>
      <div className="mb-3">
        {tpl.tag && <Badge variant="info">{tpl.tag}</Badge>}
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1"><TrendingUp size={16} /> {tpl.clones}</span>
          <span className="inline-flex items-center gap-1"><Tags size={16} /> {tpl.puntos}pts</span>
        </div>
        <Button variant="light"><Copy size={16} className="mr-2" /> Clonar</Button>
      </div>
    </div>
  )
}

export function HistoryRepository() {
  const {
    loading,
    stats,
    filters,
    templates,
    query,
    setQuery,
    categoria,
    setCategoria,
    etiqueta,
    setEtiqueta,
    puntos,
    setPuntos,
    orden,
    setOrden,
    tab,
    setTab,
  } = useHistoryRepo()

  const tabs = ['Todas', 'Más populares', 'Recientes', 'Favoritas']

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Repositorio de Historias</h1>
            <p className="text-gray-600">Biblioteca de historias de usuario reutilizables para acelerar la planificación</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="light"><Upload size={18} className="mr-2" /> Importar Plantillas</Button>
            <Button variant="dark"><Plus size={18} className="mr-2" /> Nueva Plantilla</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Total de Plantillas" value={stats.total} icon={FolderOpen} color="blue" />
          <Card title="Más Usadas" value={stats.masUsadas} icon={Star} color="orange" />
          <Card title="Clonadas este mes" value={stats.clonadasMes} icon={TrendingUp} color="green" />
          <Card title="Categorías" value={stats.categorias} icon={Tags} color="violet" />
        </div>

        <div className="mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2 relative">
                <Input
                  className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm pl-10"
                  placeholder="Buscar plantillas de historias..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="relative">
                <Select className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10" value={orden} onChange={(e) => setOrden(e.target.value)}>
                  {filters.orden.map((o) => (<option key={o} value={o}>{o}</option>))}
                </Select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="relative">
                <Select className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  {filters.categorias.map((c) => (<option key={c} value={c}>{c}</option>))}
                </Select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="relative">
                <Select className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10" value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)}>
                  {filters.etiquetas.map((e) => (<option key={e} value={e}>{e}</option>))}
                </Select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="relative">
                <Select className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10" value={puntos} onChange={(e) => setPuntos(e.target.value)}>
                  {filters.puntos.map((p) => (<option key={p} value={p}>{p}</option>))}
                </Select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`${tab === t ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'} rounded-full border border-gray-200 px-4 h-10 text-sm shadow-sm`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
          ) : templates.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">No se encontraron plantillas</div>
          ) : (
            templates.map((tpl) => (
              <TemplateCard key={tpl.code} tpl={tpl} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
