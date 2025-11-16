// Datos mock para la página de Auditoría

export const mockAuditoria = [
  {
    id: 1,
    fechaHora: '2025-01-31T10:30:00',
    usuario: 'Maria Gonzales',
    estudiante: 'Juan Carlos Perez Garcia',
    documento: 'Acuerdo de Confidencialidad',
    tipoFirma: 'Estudiante',
    accion: { tipo: 'firmados', firmados: 2, total: 4 },
  },
  {
    id: 2,
    fechaHora: '2025-01-31T11:15:00',
    usuario: 'Maria Gonzales',
    estudiante: 'María Elena Rodríguez López',
    documento: 'Acuerdo de Confidencialidad',
    tipoFirma: 'Estudiante',
    accion: { tipo: 'firmados', firmados: 4, total: 4 },
  },
  {
    id: 3,
    fechaHora: '2025-01-31T12:00:00',
    usuario: 'Maria Gonzales',
    estudiante: 'Carlos Alberto Mendoza Silva',
    documento: 'Acuerdo de Confidencialidad',
    tipoFirma: 'Estudiante',
    accion: { tipo: 'pendiente' },
  },
  {
    id: 4,
    fechaHora: '2025-01-31T13:20:00',
    usuario: 'Maria Gonzales',
    estudiante: 'Ana Patricia Flores Vega',
    documento: 'Compromisos Internos',
    tipoFirma: 'Estudiante',
    accion: { tipo: 'pendiente' },
  },
  {
    id: 5,
    fechaHora: '2025-07-31T14:45:00',
    usuario: 'Maria Gonzales',
    estudiante: 'Luis Fernando Castro Ramírez',
    documento: 'Compromisos Internos',
    tipoFirma: 'Estudiante',
    accion: { tipo: 'generada' },
  },
  {
    id: 6,
    fechaHora: '2025-07-31T15:30:00',
    usuario: 'Maria Gonzales',
    estudiante: 'Sandra Beatriz Quispe Huamán',
    documento: 'Compromisos Internos',
    tipoFirma: 'Estudiante',
    accion: { tipo: 'pendiente' },
  },
]

export const tiposDocumento = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'acuerdo-confidencialidad', label: 'Acuerdo de Confidencialidad' },
  { value: 'compromisos-internos', label: 'Compromisos Internos' },
]

export const tiposAccion = [
  { value: 'todas', label: 'Todas las Acciones' },
  { value: 'firmados', label: 'Firmados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'generada', label: 'Generada' },
]

