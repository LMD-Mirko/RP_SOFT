export const RANGES = [
  'Sprint Actual',
  'Ultimo Sprint',
  'Ultimo Sprints',
  'Este Mes',
  'Este Trimestre',
]

function variationFromRange(range) {
  switch (range) {
    case 'Ultimo Sprint':
      return { mult: 0.95, offset: -1 }
    case 'Ultimo Sprints':
      return { mult: 0.9, offset: -2 }
    case 'Este Mes':
      return { mult: 1.05, offset: +1 }
    case 'Este Trimestre':
      return { mult: 1.1, offset: +2 }
    case 'Sprint Actual':
    default:
      return { mult: 1.0, offset: 0 }
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

export function getMetricStats(range = 'Sprint Actual') {
  const v = variationFromRange(range)
  const base = [
    { id: 'velocidad', titulo: 'Velocidad Promedio', valor: 42, sufijo: 'pts/sprint', tendencia: +5, color: 'blue' },
    { id: 'completitud', titulo: 'Tasa de Completitud', valor: 87, sufijo: 'de tareas', tendencia: +3, color: 'green' },
    { id: 'tiempo', titulo: 'Tiempo Promedio', valor: 2.3, sufijo: 'días/tarea', tendencia: +1, color: 'violet' },
    { id: 'precision', titulo: 'Precisión de Estimación', valor: 78, sufijo: 'accuracy', tendencia: -2, color: 'orange' },
  ]
  const data = base.map(s => {
    let val = s.id === 'tiempo' ? s.valor * (2 - v.mult) : s.valor * v.mult
    if (s.id === 'completitud' || s.id === 'precision') val = clamp(val, 50, 99)
    return {
      ...s,
      valor: s.id === 'tiempo' ? val.toFixed(1) : Math.round(val).toString(),
      tendencia: `${s.tendencia + v.offset >= 0 ? '+' : ''}${s.tendencia + v.offset}%`,
    }
  })
  return Promise.resolve(data)
}

export function getVelocitySeries(range = 'Sprint Actual') {
  const v = variationFromRange(range)
  const values = [45, 52, 61, 58, 54].map((n, i) => Math.max(10, Math.round(n * (v.mult + (i - 2) * 0.02))))
  return Promise.resolve({
    labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'],
    values,
  })
}

export function getBurndownSeries(range = 'Sprint Actual') {
  const v = variationFromRange(range)
  const ideal = [55, 46, 37, 28, 19, 10, 0]
  const real = [55, 50, 44, 40, 30, 22, 12].map((n, i) => clamp(Math.round(n * (1 + (v.offset * 0.02) - i * 0.01)), 0, 60))
  return Promise.resolve({
    labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7'],
    ideal,
    real,
  })
}

export function getTeamPerformance(range = 'Sprint Actual') {
  const v = variationFromRange(range)
  const base = [
    { id: 'u1', iniciales: 'JP', nombre: 'Juan Perez', rol: 'Senior Backend', tareas: 24, puntos: 48, tendencia: +5, progreso: 85 },
    { id: 'u2', iniciales: 'MG', nombre: 'Maria Garcia', rol: 'Desarrolladora', tareas: 19, puntos: 32, tendencia: +3, progreso: 72 },
    { id: 'u3', iniciales: 'CL', nombre: 'Carlos Lopez', rol: 'QA', tareas: 16, puntos: 30, tendencia: -5, progreso: 58 },
    { id: 'u4', iniciales: 'AM', nombre: 'Ana Martinez', rol: 'UI Designer', tareas: 9, puntos: 17, tendencia: +2, progreso: 44 },
    { id: 'u5', iniciales: 'LR', nombre: 'Luis Rodriguez', rol: 'DevOps', tareas: 12, puntos: 29, tendencia: +3, progreso: 60 },
  ]
  const data = base.map((m, i) => {
    const mult = v.mult + (i - 2) * 0.01
    const tareas = Math.max(5, Math.round(m.tareas * mult))
    const puntos = Math.max(10, Math.round(m.puntos * mult))
    const progreso = clamp(Math.round(m.progreso * mult), 20, 98)
    const tendencia = m.tendencia + v.offset + (i % 2 === 0 ? 0 : 1)
    return {
      ...m,
      tareas,
      puntos,
      progreso,
      tendencia: `${tendencia >= 0 ? '+' : ''}${tendencia}%`,
    }
  })
  return Promise.resolve(data)
}

export async function getAllMetrics(range = 'Sprint Actual') {
  const [stats, velocity, burndown, team] = await Promise.all([
    getMetricStats(range),
    getVelocitySeries(range),
    getBurndownSeries(range),
    getTeamPerformance(range),
  ])
  return { stats, velocity, burndown, team }
}
