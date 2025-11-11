import { useEffect, useState } from 'react'
import { getSprintStats, getSprintColumns, getMembers } from '../services/sprint.service'

export function useSprintBoard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [columns, setColumns] = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [s, c, m] = await Promise.all([
        getSprintStats(),
        getSprintColumns(),
        getMembers(),
      ])
      setStats(s)
      setColumns(c)
      setMembers(m)
      setLoading(false)
    }
    load()
  }, [])

  return {
    loading,
    stats,
    columns,
    members,
  }
}
