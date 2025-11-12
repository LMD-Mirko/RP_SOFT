export function getMetricStats() {
  return Promise.resolve([
    { id: 'velocidad', titulo: 'Velocidad Promedio', valor: '42', sufijo: 'pts/sprint', tendencia: '+5%', color: 'blue' },
    { id: 'completitud', titulo: 'Tasa de Completitud', valor: '87%', sufijo: 'de tareas', tendencia: '+3%', color: 'green' },
    { id: 'tiempo', titulo: 'Tiempo Promedio', valor: '2.3', sufijo: 'días/tarea', tendencia: '+1%', color: 'violet' },
    { id: 'precision', titulo: 'Precisión de Estimación', valor: '78%', sufijo: 'accuracy', tendencia: '-2%', color: 'orange' },
  ])
}

export function getVelocitySeries() {
  // puntos completados por sprint
  return Promise.resolve({
    labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'],
    values: [45, 52, 61, 58, 54],
  })
}

export function getBurndownSeries() {
  // Story points restantes por día (simulado)
  return Promise.resolve({
    labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7'],
    ideal: [55, 46, 37, 28, 19, 10, 0],
    real: [55, 50, 44, 40, 30, 22, 12],
  })
}

export function getTeamPerformance() {
  return Promise.resolve([
    { id: 'u1', iniciales: 'JP', nombre: 'Juan Perez', rol: 'Senior Backend', tareas: 24, puntos: 48, tendencia: '+5%', progreso: 85 },
    { id: 'u2', iniciales: 'MG', nombre: 'Maria Garcia', rol: 'Desarrolladora', tareas: 19, puntos: 32, tendencia: '+3%', progreso: 72 },
    { id: 'u3', iniciales: 'CL', nombre: 'Carlos Lopez', rol: 'QA', tareas: 16, puntos: 30, tendencia: '-5%', progreso: 58 },
    { id: 'u4', iniciales: 'AM', nombre: 'Ana Martinez', rol: 'UI Designer', tareas: 9, puntos: 17, tendencia: '+2%', progreso: 44 },
    { id: 'u5', iniciales: 'LR', nombre: 'Luis Rodriguez', rol: 'DevOps', tareas: 12, puntos: 29, tendencia: '+3%', progreso: 60 },
  ])
}
