export function getRepoStats() {
  return Promise.resolve({
    total: 47,
    masUsadas: 12,
    clonadasMes: 28,
    categorias: 8,
  })
}

export function getRepoFilters() {
  return Promise.resolve({
    categorias: ['Todas las categorías', 'Autenticación', 'Notificaciones', 'API', 'Reportes'],
    etiquetas: ['Todas las etiquetas', 'Seguridad', 'UI', 'CRUD', 'Email'],
    puntos: ['Todos los puntos', '<=5', '6-8', '9-13', '14+'],
    orden: ['Todos los ordenes', 'Más populares', 'Recientes', 'Favoritas'],
  })
}

export function getTemplates() {
  const data = [
    {
      code: 'TPL-001',
      title: 'Sistema de Autenticación con Email',
      desc: 'Historia completa para implementar login, registro y recuperación de...',
      tag: 'Autenticación',
      puntos: 6,
      clones: 15,
      stars: 5,
    },
    {
      code: 'TPL-002',
      title: 'Dashboard de Métricas en Tiempo Real',
      desc: 'Interfaz con gráficas y actualizaciones en vivo...',
      tag: 'UI',
      puntos: 13,
      clones: 12,
      stars: 4,
    },
    {
      code: 'TPL-003',
      title: 'CRUD Completo de Entidad',
      desc: 'Operaciones crear, leer, actualizar y eliminar con validaciones...',
      tag: 'CRUD',
      puntos: 8,
      clones: 25,
      stars: 5,
    },
    {
      code: 'TPL-004',
      title: 'Sistema de Notificaciones Push',
      desc: 'Implementación de notificaciones multi-canal y en tiempo real...',
      tag: 'Notificaciones',
      puntos: 13,
      clones: 8,
      stars: 3,
    },
    {
      code: 'TPL-005',
      title: 'Integración con API Externa',
      desc: 'Conexión, autenticación y manejo de respuestas de APIs de terceros...',
      tag: 'API',
      puntos: 6,
      clones: 10,
      stars: 4,
    },
  ]
  return Promise.resolve(data)
}
