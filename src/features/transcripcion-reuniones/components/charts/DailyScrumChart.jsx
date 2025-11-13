import { useEffect, useMemo, useRef, useState } from 'react'
import styles from '../../modules/daily-scrum/pages/DailyScrumPage.module.css'

function generateSeries(length, min, max) {
  const arr = []
  let val = min + Math.random() * (max - min)
  for (let i = 0; i < length; i++) {
    const target = min + Math.random() * (max - min)
    val = val * 0.7 + target * 0.3 // transición suave
    arr.push(Math.round(val))
  }
  return arr
}

function formatYAxisLabel(v) {
  if (v >= 1000) return `${Math.round(v / 1000)}k`
  return `${v}`
}

export function DailyScrumChart() {
  const [view, setView] = useState('Mes')
  const containerRef = useRef(null)
  const [svgSize, setSvgSize] = useState({ width: 900, height: 360 })
  const [hoverIndex, setHoverIndex] = useState(null)

  const VIEWS = useMemo(() => ({
    Dia: {
      labels: Array.from({ length: 12 }, (_, i) => `${i + 8}:00`),
      values: generateSeries(12, 3, 15),
      maxY: 18,
    },
    Semana: {
      labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      values: generateSeries(7, 5, 14),
      maxY: 16,
    },
    Mes: {
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      values: generateSeries(30, 600, 2000),
      maxY: 2000,
    },
    Año: {
      labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      values: generateSeries(12, 800, 2400),
      maxY: 2400,
    },
  }), [])

  const data = VIEWS[view]
  const { width, height } = svgSize
  const padding = { left: 48, right: 24, top: 24, bottom: 40 }

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = Math.max(320, Math.round(w * 0.4))
      setSvgSize({ width: w, height: h })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const points = useMemo(() => {
    const xStep = (width - padding.left - padding.right) / (data.values.length - 1)
    const yMax = data.maxY
    return data.values.map((v, i) => {
      const x = padding.left + i * xStep
      const y = padding.top + (1 - v / yMax) * (height - padding.top - padding.bottom)
      return [x, y]
    })
  }, [data, width, height])

  // Generar curva suave (Cardinal spline -> Bezier)
  const pathD = useMemo(() => {
    if (points.length < 2) return ''
    const t = 0.25
    let d = `M ${points[0][0]} ${points[0][1]}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2] || p2
      const cp1x = p1[0] + t * (p2[0] - p0[0])
      const cp1y = p1[1] + t * (p2[1] - p0[1])
      const cp2x = p2[0] - t * (p3[0] - p1[0])
      const cp2y = p2[1] - t * (p3[1] - p1[1])
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`
    }
    return d
  }, [points])

  const areaD = useMemo(() => {
    const baselineY = height - padding.bottom
    const start = `M ${points[0][0]} ${baselineY}`
    const t = 0.25
    let curve = ''
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2] || p2
      const cp1x = p1[0] + t * (p2[0] - p0[0])
      const cp1y = p1[1] + t * (p2[1] - p0[1])
      const cp2x = p2[0] - t * (p3[0] - p1[0])
      const cp2y = p2[1] - t * (p3[1] - p1[1])
      curve += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`
    }
    const end = ` L ${points[points.length - 1][0]} ${baselineY} Z`
    return `${start}${curve}${end}`
  }, [points, height, padding.bottom])

  const pathRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const length = path.getTotalLength()
    path.style.transition = 'none'
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    // trigger reflow
    path.getBoundingClientRect()
    path.style.transition = 'stroke-dashoffset 800ms ease'
    path.style.strokeDashoffset = '0'
  }, [pathD])

  // Interacción para tooltip
  const handleMove = (evt) => {
    const bounds = evt.currentTarget.getBoundingClientRect()
    const mx = evt.clientX - bounds.left
    const xStep = (width - padding.left - padding.right) / (data.values.length - 1)
    let idx = Math.round((mx - padding.left) / xStep)
    idx = Math.max(0, Math.min(data.values.length - 1, idx))
    setHoverIndex(idx)
  }
  const handleLeave = () => setHoverIndex(null)

  return (
    <div ref={containerRef} className={styles.chartFadeIn}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {Object.keys(VIEWS).map((k) => (
          <button
            key={k}
            onClick={() => setView(k)}
            className={`${styles.tab} ${view === k ? styles.tabActive : ''}`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Chart */}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* y grid lines */}
        {[0.25, 0.5, 0.75].map((g, idx) => (
          <line
            key={idx}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + g * (height - padding.top - padding.bottom)}
            y2={padding.top + g * (height - padding.top - padding.bottom)}
            stroke="#e5e7eb"
            strokeDasharray="4 4"
          />
        ))}

        {/* Axes */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#9ca3af" />
        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#9ca3af" />

        {/* y labels */}
        {[0, 0.5, 1].map((t, idx) => (
          <text key={idx} x={8} y={height - padding.bottom - t * (height - padding.top - padding.bottom) + 4} fontSize="12" fill="#6b7280">
            {formatYAxisLabel(Math.round(t * data.maxY))}
          </text>
        ))}

        {/* x labels */}
        {data.labels.map((lab, i) => {
          const xStep = (width - padding.left - padding.right) / (data.labels.length - 1)
          const x = padding.left + i * xStep
          const y = height - padding.bottom + 16
          return (
            <text key={i} x={x} y={y} fontSize="12" textAnchor="middle" fill="#6b7280">{lab}</text>
          )
        })}

        {/* gradient */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* area */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* line */}
        <path ref={pathRef} d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

        {/* overlay para eventos */}
        <rect
          x={padding.left}
          y={padding.top}
          width={width - padding.left - padding.right}
          height={height - padding.top - padding.bottom}
          fill="transparent"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        />

        {hoverIndex != null && (
          <g>
            {/* línea vertical */}
            <line
              x1={points[hoverIndex][0]}
              x2={points[hoverIndex][0]}
              y1={padding.top}
              y2={height - padding.bottom}
              stroke="#d1d5db"
            />
            {/* punto */}
            <circle cx={points[hoverIndex][0]} cy={points[hoverIndex][1]} r={5} fill="#fff" stroke="#3b82f6" strokeWidth={3} />

            {/* tooltip */}
            <g transform={`translate(${points[hoverIndex][0] + 12}, ${points[hoverIndex][1] - 10})`}>
              <rect x={-6} y={-22} rx={8} ry={8} width={160} height={48} fill="#ffffff" stroke="#e5e7eb" />
              <text x={8} y={-6} fontSize="14" fontWeight="700" fill="#111827">{data.labels[hoverIndex]}</text>
              <text x={8} y={14} fontSize="13" fill="#3b82f6">Transcripciones: {data.values[hoverIndex]}</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}