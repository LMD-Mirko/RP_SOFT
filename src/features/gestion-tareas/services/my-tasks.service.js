let TASKS = [
  {
    id: 't1',
    titulo: 'Implementar componente de login',
    descripcion: 'Crear componente de autenticación con validación',
    equipo: 'Equipo A',
    prioridad: 'Alta',
    hasta: '04/11/2025',
    estado: 'En Proceso',
    tags: ['React', 'API REST'],
  },
  {
    id: 't2',
    titulo: 'Diseñar mockups de dashboard',
    descripcion: 'Crear diseños en Figma para el nuevo dashboard',
    equipo: 'Equipo B',
    prioridad: 'Media',
    hasta: '08/11/2025',
    estado: 'Pendiente',
    tags: ['Diseño'],
  },
  {
    id: 't3',
    titulo: 'Configurar base de datos',
    descripcion: 'Configurar PostgreSQL y crear esquema inicial',
    equipo: 'Equipo A',
    prioridad: 'Alta',
    hasta: '23/10/2025',
    estado: 'Completado',
    tags: ['SQL', 'Docker'],
  },
]

export function getMyTasks() {
  return Promise.resolve([...TASKS])
}

export function createTask(task) {
  const id = 't' + (Date.now())
  const newTask = { id, ...task }
  TASKS = [newTask, ...TASKS]
  return Promise.resolve(newTask)
}

export function updateTask(id, data) {
  TASKS = TASKS.map((t) => (t.id === id ? { ...t, ...data } : t))
  return Promise.resolve(TASKS.find((t) => t.id === id))
}
