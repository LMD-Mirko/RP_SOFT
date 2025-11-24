import { useEffect, useMemo, useState } from 'react'
import { getRepoStats, getRepoFilters, getTemplates } from '../services/history-repo.service'

export function useHistoryRepo() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, masUsadas: 0, clonadasMes: 0, categorias: 0 })
  const [filters, setFilters] = useState({ categorias: [], etiquetas: [], proyectos: [], orden: [] })
  const [templates, setTemplates] = useState([])

  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState('Todas las categorías')
  const [etiqueta, setEtiqueta] = useState('Todas las etiquetas')
  const [proyecto, setProyecto] = useState('Todos los Proyectos')
  const [orden, setOrden] = useState('Todos')
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
    if (proyecto !== 'Todos los Proyectos') data = data.filter((tpl) => tpl.proyecto === proyecto)
    if (orden === 'Más populares') data.sort((a, b) => (b.clones || 0) - (a.clones || 0))
    if (orden === 'Recientes') data = data.slice().reverse()
    if (orden === 'Favoritas') data = data.filter((tpl) => tpl.favorito)
    return data
  }, [templates, query, categoria, etiqueta, proyecto, orden])

  const toggleFavorito = (code) => {
    setTemplates((prev) => prev.map((t) => (t.code === code ? { ...t, favorito: !t.favorito } : t)))
  }

  const duplicateTemplate = (code) => {
    setTemplates((prev) => {
      const original = prev.find((t) => t.code === code)
      if (!original) return prev
      let idx = 1
      let newCode = `${original.code}-CLON-${idx}`
      const codes = new Set(prev.map((t) => t.code))
      while (codes.has(newCode)) {
        idx += 1
        newCode = `${original.code}-CLON-${idx}`
      }
      const clone = { ...original, code: newCode, clones: (original.clones || 0) + 1 }
      return [clone, ...prev]
    })
  }

  const deleteTemplate = (code) => {
    setTemplates((prev) => prev.filter((t) => t.code !== code))
  }

  const updateTemplate = (code, updates) => {
    setTemplates((prev) => prev.map((t) => (t.code === code ? { ...t, ...updates } : t)))
  }

  const addTemplate = (tpl) => {
    setTemplates((prev) => [tpl, ...prev])
  }

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
    proyecto,
    setProyecto,
    orden,
    setOrden,
    tab,
    setTab,
    toggleFavorito,
    duplicateTemplate,
    deleteTemplate,
    updateTemplate,
    addTemplate,
  }
}
