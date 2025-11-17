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
    categorias: [
      'Todas las categorías',
      'Autenticación',
      'CRUD',
      'Interfaz de Usuario',
      'Integración API',
      'Reportes',
      'Notificaciones',
    ],
    etiquetas: [
      'Todas las etiquetas',
      'FrontEnd',
      'Back-End',
      'API',
      'Diseño UI/UX',
      'Seguridad',
      'Base de Datos',
    ],
    proyectos: [
      'Todos los Proyectos',
      'PB-M1 (Autenticación)',
      'PB-M2 (Usuarios)',
      'PB-M3 (Dashboard)',
      'PB-M4 (Reportes)',
      'PB-M5 (API)',
    ],
    orden: ['Todos', 'Más populares', 'Recientes', 'Favoritas'],
  })
}

export function getTemplates() {
  const data = [
    {
      code: 'TPL-001',
      title: 'Sistema de Autenticación con Email',
      desc: 'Historia completa para implementar login, registro y recuperación de...',
      tag: 'Autenticación',
      proyecto: 'PB-M1 (Autenticación)',
      favorito: false,
      clones: 15,
    },
    {
      code: 'TPL-002',
      title: 'Dashboard de Métricas en Tiempo Real',
      desc: 'Interfaz con gráficas y actualizaciones en vivo...',
      tag: 'Interfaz de Usuario',
      proyecto: 'PB-M3 (Dashboard)',
      favorito: true,
      clones: 12,
    },
    {
      code: 'TPL-003',
      title: 'CRUD Completo de Entidad',
      desc: 'Operaciones crear, leer, actualizar y eliminar con validaciones...',
      tag: 'CRUD',
      proyecto: 'PB-M2 (Usuarios)',
      favorito: false,
      clones: 25,
    },
    {
      code: 'TPL-004',
      title: 'Sistema de Notificaciones Push',
      desc: 'Implementación de notificaciones multi-canal y en tiempo real...',
      tag: 'Notificaciones',
      proyecto: 'PB-M3 (Dashboard)',
      favorito: false,
      clones: 8,
    },
    {
      code: 'TPL-005',
      title: 'Integración con API Externa',
      desc: 'Conexión, autenticación y manejo de respuestas de APIs de terceros...',
      tag: 'Integración API',
      proyecto: 'PB-M5 (API)',
      favorito: false,
      clones: 10,
    },
  ]
  return Promise.resolve(data)
}
