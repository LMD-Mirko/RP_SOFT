import { useEffect, useState } from 'react'
import { getMetricStats, getVelocitySeries, getBurndownSeries, getTeamPerformance } from '../services/metrics.service'

export function useMetrics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [velocity, setVelocity] = useState({ labels: [], values: [] })
  const [burndown, setBurndown] = useState({ labels: [], ideal: [], real: [] })
  const [team, setTeam] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [st, vel, burn, tm] = await Promise.all([
        getMetricStats(),
        getVelocitySeries(),
        getBurndownSeries(),
        getTeamPerformance(),
      ])
      setStats(st)
      setVelocity(vel)
      setBurndown(burn)
      setTeam(tm)
      setLoading(false)
    }
    load()
  }, [])

  return { loading, stats, velocity, burndown, team }
}
