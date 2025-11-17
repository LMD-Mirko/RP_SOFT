import React from 'react'

// Por defecto: datos del ejemplo del screenshot
const defaultLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const defaultValues = [8, 12, 12, 11, 6]

export function TranscripcionesSemanal({ labels = defaultLabels, values = defaultValues, width = 640, height = 260 }) {
  const padding = 28
  const maxV = Math.max(...values, 12)
  const plotW = width - padding * 2
  const plotH = height - padding * 2
  const barW = plotW / values.length

  const toY = (v) => padding + plotH - (v / maxV) * plotH

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Transcripciones por semana">
      {/* Guías horizontales */}
      {[0, 3, 6, 9, 12].map((g) => (
        <g key={g}>
          <line x1={padding} y1={toY(g)} x2={width - padding} y2={toY(g)} stroke="#e5e7eb" />
          <text x={padding - 10} y={toY(g)} textAnchor="end" dominantBaseline="middle" fontSize="12" fill="#6b7280">{g}</text>
        </g>
      ))}

      {/* Barras */}
      {values.map((v, i) => {
        const x = padding + i * barW + barW * 0.2
        const w = barW * 0.6
        const y = toY(v)
        const h = padding + plotH - y
        return <rect key={i} x={x} y={y} width={w} height={h} rx={6} fill="#3b82f6" />
      })}

      {/* Etiquetas inferiores */}
      {labels.map((lab, i) => (
        <text key={lab} x={padding + i * barW + barW / 2} y={height - padding + 18} textAnchor="middle" fontSize="12" fill="#374151">{lab}</text>
      ))}
    </svg>
  )
}

export default TranscripcionesSemanal