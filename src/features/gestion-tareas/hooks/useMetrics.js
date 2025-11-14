import { useEffect, useRef, useState } from 'react'
import { RANGES, getAllMetrics } from '../services/metrics.service'

export function useMetrics() {
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('Sprint Actual')
  const [stats, setStats] = useState([])
  const [velocity, setVelocity] = useState({ labels: [], values: [] })
  const [burndown, setBurndown] = useState({ labels: [], ideal: [], real: [] })
  const [team, setTeam] = useState([])

  const animRef = useRef({ raf: null })

  function cancelAnim() {
    if (animRef.current.raf) {
      cancelAnimationFrame(animRef.current.raf)
      animRef.current.raf = null
    }
  }

  function tween(from, to, t) {
    return from + (to - from) * t
  }

  function tweenArray(from = [], to = [], t) {
    const len = Math.min(from.length, to.length)
    const out = new Array(len)
    for (let i = 0; i < len; i++) out[i] = Math.round(tween(Number(from[i]), Number(to[i]), t))
    return out
  }

  function tweenStats(from = [], to = [], t) {
    const byId = Object.fromEntries(from.map(s => [s.id, s]))
    return to.map(s => {
      const f = byId[s.id] || s
      const isNum = !isNaN(Number(f.valor)) && !isNaN(Number(s.valor))
      const valor = isNum ? tween(Number(f.valor), Number(s.valor), t) : s.valor
      return {
        ...s,
        valor: typeof valor === 'number' ? (s.id === 'tiempo' ? valor.toFixed(1) : Math.round(valor).toString()) : valor,
      }
    })
  }

  function tweenTeam(from = [], to = [], t) {
    const byId = Object.fromEntries(from.map(m => [m.id, m]))
    return to.map(m => {
      const f = byId[m.id] || m
      return {
        ...m,
        tareas: Math.round(tween(Number(f.tareas || 0), Number(m.tareas || 0), t)),
        puntos: Math.round(tween(Number(f.puntos || 0), Number(m.puntos || 0), t)),
        progreso: Math.round(tween(Number(f.progreso || 0), Number(m.progreso || 0), t)),
      }
    })
  }

  async function load(rangeSel) {
    setLoading(true)
    const data = await getAllMetrics(rangeSel)
    setStats(data.stats)
    setVelocity(data.velocity)
    setBurndown(data.burndown)
    setTeam(data.team)
    setLoading(false)
  }

  async function changeRange(nextRange) {
    if (nextRange === range) return
    cancelAnim()
    const prev = { stats, velocity, burndown, team }
    const data = await getAllMetrics(nextRange)

    // Animación de 500ms con rAF
    const duration = 500
    const start = performance.now()
    function step(now) {
      const t = Math.min(1, (now - start) / duration)
      setStats(tweenStats(prev.stats, data.stats, t))
      setVelocity({ labels: data.velocity.labels, values: tweenArray(prev.velocity.values, data.velocity.values, t) })
      setBurndown({ labels: data.burndown.labels, ideal: data.burndown.ideal, real: tweenArray(prev.burndown.real, data.burndown.real, t) })
      setTeam(tweenTeam(prev.team, data.team, t))
      if (t < 1) {
        animRef.current.raf = requestAnimationFrame(step)
      } else {
        animRef.current.raf = null
        setRange(nextRange)
      }
    }
    animRef.current.raf = requestAnimationFrame(step)
  }

  useEffect(() => {
    load(range)
    return () => cancelAnim()
  }, [])

  return { loading, stats, velocity, burndown, team, range, ranges: RANGES, changeRange }
}
