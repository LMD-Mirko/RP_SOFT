export const stories = [
  {
    id: 'US-001',
    prioridad: 'Crítica',
    estado: 'Lista',
    etiqueta: 'Autenticación',
    titulo: 'Como usuario quiero poder iniciar sesion con mi correo electronico',
    descripcion: 'Implementar sistema de autenticacion con email y contraseña',
    puntos: 8,
    autor: 'Juan Perez',
    listaParaSprint: true,
    estimada: true,
  },
  {
    id: 'US-002',
    prioridad: 'Alta',
    estado: 'Lista',
    etiqueta: 'Asistencia',
    titulo: 'Como practicante quiero ver mi historial de asistencia',
    descripcion: 'Dashboard con graficos y estadisticas de asistencia personal',
    puntos: 5,
    autor: 'Maria Garcia',
    listaParaSprint: true,
    estimada: true,
  },
  {
    id: 'US-003',
    prioridad: 'Media',
    estado: 'En revisión',
    etiqueta: 'Reportes',
    titulo: 'Como usuario quiero exportar reportes en formato CSV',
    descripcion: 'Exportación de listados con filtros actuales en CSV',
    puntos: null,
    autor: 'Carlos Ramirez',
    listaParaSprint: false,
    estimada: false,
  },
]

export function getStories() {
  return Promise.resolve([...stories])
}

export function getPriorities() {
  return Promise.resolve(['Todas las prioridades', 'Crítica', 'Alta', 'Media', 'Baja'])
}

export function getStates() {
  return Promise.resolve(['Todos los Estados', 'Lista', 'En revisión', 'Hecha'])
}
