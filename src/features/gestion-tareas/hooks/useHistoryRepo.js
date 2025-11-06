import { useEffect, useMemo, useState } from 'react'
import { getRepoStats, getRepoFilters, getTemplates } from '../services/history-repo.service'

export function useHistoryRepo() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, masUsadas: 0, clonadasMes: 0, categorias: 0 })
  const [filters, setFilters] = useState({ categorias: [], etiquetas: [], puntos: [], orden: [] })
  const [templates, setTemplates] = useState([])

  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState('Todas las categorías')
  const [etiqueta, setEtiqueta] = useState('Todas las etiquetas')
  const [puntos, setPuntos] = useState('Todos los puntos')
  const [orden, setOrden] = useState('Todos los ordenes')
  const [tab, setTab] = useState('Todas')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [s, f, t] = await Promise.all([getRepoStats(), getRepoFilters(), getTemplates()])
      setStats(s)
      setFilters(f)
      setTemplates(t)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let data = [...templates]
    const q = query.trim().toLowerCase()
    if (q) data = data.filter((tpl) => tpl.title.toLowerCase().includes(q) || tpl.desc.toLowerCase().includes(q) || tpl.code.toLowerCase().includes(q))
    if (categoria !== 'Todas las categorías') data = data.filter((tpl) => tpl.tag === categoria)
    if (etiqueta !== 'Todas las etiquetas') data = data.filter((tpl) => tpl.desc.toLowerCase().includes(etiqueta.toLowerCase()))
    if (puntos !== 'Todos los puntos') {
      data = data.filter((tpl) => {
        const p = tpl.puntos || 0
        if (puntos === '<=5') return p <= 5
        if (puntos === '6-8') return p >= 6 && p <= 8
        if (puntos === '9-13') return p >= 9 && p <= 13
        if (puntos === '14+') return p >= 14
        return true
      })
    }
    if (orden === 'Más populares') data.sort((a, b) => (b.clones || 0) - (a.clones || 0))
    if (orden === 'Recientes') data = data.slice().reverse()
    if (orden === 'Favoritas') data = data.filter((tpl) => (tpl.stars || 0) >= 4)
    return data
  }, [templates, query, categoria, etiqueta, puntos, orden])

  return {
    loading,
    stats,
    filters,
    templates: filtered,
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
  }
}
