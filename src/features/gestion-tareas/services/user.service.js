export function getUserSummary() {
  return Promise.resolve({
    completadas: 1,
    pendientes: 2,
    progreso: 33,
    rol: 'Frontend',
    mentor: {
      nombre: 'Juan Perez',
      cargo: 'Mentor Asignado',
      correo: 'carlos.lopez@empresa.com',
      estado: 'Online',
    },
  })
}

export function getProgressSeries() {
  return Promise.resolve({
    labels: ['7oct', '8oct', '9oct', '10oct', '11oct', '12oct'],
    values: [1.2, 0.8, 0.3, 2.1, 1.6, 1.9],
  })
}

export function getUrgentTasks() {
  return Promise.resolve([
    {
      id: 't1',
      titulo: 'Implementar componente de login',
      etiqueta: 'Alto',
      descripcion: 'Crear componente de autenticación con validación',
      fecha: '4/11/2025',
      estado: 'En Proceso',
    },
    {
      id: 't2',
      titulo: 'Diseñar mockups de dashboard',
      etiqueta: 'Media',
      descripcion: 'Crear diseños en Figma para el nuevo dashboard',
      fecha: '9/11/2025',
      estado: 'Pendiente',
    },
  ])
}
