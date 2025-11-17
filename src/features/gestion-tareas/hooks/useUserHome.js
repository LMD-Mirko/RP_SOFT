import { useEffect, useState } from 'react'
import { getUserSummary, getProgressSeries, getUrgentTasks } from '../services/user.service'

export function useUserHome() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [series, setSeries] = useState({ labels: [], values: [] })
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [s, sr, tk] = await Promise.all([
        getUserSummary(),
        getProgressSeries(),
        getUrgentTasks(),
      ])
      setSummary(s)
      setSeries(sr)
      setTasks(tk)
      setLoading(false)
    }
    load()
  }, [])

  return { loading, summary, series, tasks }
}
