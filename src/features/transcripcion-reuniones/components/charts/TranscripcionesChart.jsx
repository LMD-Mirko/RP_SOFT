import React from 'react'

// Datos de ejemplo (simulan el gráfico del mes)
const days = Array.from({ length: 30 }, (_, i) => i + 1)
const values = [
  80, 120, 160, 200, 195, 230, 260, 290, 270, 255,
  230, 250, 210, 170, 160, 155, 140, 115, 95, 80,
  60, 35, 18, 22, 10, 55, 70, 65, 95, 120,
]

function buildPath(width, height, padding) {
  const maxV = Math.max(...values)
  const minV = Math.min(...values)
  const plotW = width - padding * 2
  const plotH = height - padding * 2
  const stepX = plotW / (days.length - 1)
  const norm = (v) => (v - minV) / (maxV - minV)
  const pts = values.map((v, i) => {
    const x = padding + i * stepX
    const y = padding + plotH - norm(v) * plotH
    return `${x},${y}`
  })
  return pts.join(' ')
}

export function TranscripcionesChart({ width = 1024, height = 340 }) {
  const padding = 24
  const path = buildPath(width, height, padding)

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico de transcripciones">
      {/* Ejes y guías simples */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#d1d5db" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#d1d5db" />
      {/* Línea del gráfico (sin área de relleno) */}
      <polyline points={path} fill="none" stroke="#3b82f6" strokeWidth="3" />
    </svg>
  )
}

export default TranscripcionesChart