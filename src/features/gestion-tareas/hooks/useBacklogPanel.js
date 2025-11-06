import { useEffect, useMemo, useState } from 'react'
import { getStories, getPriorities, getStates } from '../services/backlog.service'

export function useBacklogPanel() {
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState([])
  const [priorities, setPriorities] = useState([])
  const [states, setStates] = useState([])

  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState('Todas las prioridades')
  const [state, setState] = useState('Todos los Estados')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [data, p, s] = await Promise.all([
        getStories(),
        getPriorities(),
        getStates(),
      ])
      setStories(data)
      setPriorities(p)
      setStates(s)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return stories.filter((st) => {
      const matchesQ = !q ||
        st.id.toLowerCase().includes(q) ||
        st.titulo.toLowerCase().includes(q) ||
        (st.descripcion || '').toLowerCase().includes(q)
      const matchesP = priority === 'Todas las prioridades' || st.prioridad === priority
      const matchesS = state === 'Todos los Estados' || st.estado === state
      return matchesQ && matchesP && matchesS
    })
  }, [stories, query, priority, state])

  const stats = useMemo(() => {
    const total = stories.length
    const puntos = stories.reduce((acc, s) => acc + (s.puntos || 0), 0)
    const listasSprint = stories.filter((s) => s.listaParaSprint).length
    const sinEstimar = stories.filter((s) => !s.estimada || s.puntos == null).length
    return { total, puntos, listasSprint, sinEstimar }
  }, [stories])

  return {
    loading,
    stories: filtered,
    priorities,
    states,
    query,
    setQuery,
    priority,
    setPriority,
    state,
    setState,
    stats,
  }
}
