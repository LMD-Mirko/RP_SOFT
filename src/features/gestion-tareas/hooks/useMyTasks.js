import { useEffect, useMemo, useState } from 'react'
import { getMyTasks } from '../services/my-tasks.service'

export function useMyTasks() {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Todas')

  const reload = async () => {
    setLoading(true)
    const list = await getMyTasks()
    setTasks(list)
    setLoading(false)
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks.filter((t) => {
      const matchesQ = !q || t.titulo.toLowerCase().includes(q) || t.descripcion.toLowerCase().includes(q)
      const matchesS =
        status === 'Todas' ||
        (status === 'Pendientes' && t.estado === 'Pendiente') ||
        (status === 'En Proceso' && t.estado === 'En Proceso') ||
        (status === 'Completadas' && t.estado === 'Completado')
      return matchesQ && matchesS
    })
  }, [tasks, query, status])

  const statuses = ['Todas', 'Pendientes', 'En Proceso', 'Completadas']

  return { loading, tasks: filtered, query, setQuery, status, setStatus, statuses, total: filtered.length, reload }
}
