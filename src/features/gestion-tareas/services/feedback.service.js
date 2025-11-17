let EVALUACIONES = [
  {
    id: 'ev1',
    autor: 'Juan García',
    fecha: '14 de octubre de 2024',
    nota: 8.5,
    comentario: 'Excelente progreso en las tareas asignadas. Muy dedicado y proactivo.',
  },
  {
    id: 'ev2',
    autor: 'Juan García',
    fecha: '14 de octubre de 2024',
    nota: 6.5,
    comentario: 'Excelente progreso en las tareas asignadas. Muy dedicado y proactivo.',
  },
  {
    id: 'ev3',
    autor: 'Juan García',
    fecha: '14 de octubre de 2024',
    nota: 7.5,
    comentario: 'Excelente progreso en las tareas asignadas. Muy dedicado y proactivo.',
  },
]

let FEEDBACKS = []

export function getEvaluaciones() {
  return Promise.resolve([...EVALUACIONES])
}

export function enviarFeedback(texto) {
  const payload = { id: 'fb-' + Date.now(), texto, fecha: new Date().toISOString() }
  FEEDBACKS = [payload, ...FEEDBACKS]
  return Promise.resolve(payload)
}
