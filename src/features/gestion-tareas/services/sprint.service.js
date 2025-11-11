export function getSprintStats() {
  return Promise.resolve({
    nombre: 'Sprint 5 - Gestión de Tareas y Notificaciones',
    estado: 'Sprint Activo',
    duracion: '2 Semanas',
    diasRestantes: 5,
    puntosHechos: 34,
    puntosTotales: 55,
    velocidad: 6.8,
    tendencia: '+12% vs anterior',
    equipo: 8,
  })
}

export function getSprintColumns() {
  const columns = [
    {
      id: 'col-1',
      titulo: 'Product Backlog',
      cards: [
        {
          id: 'HU01',
          tags: ['Prioridad Alta', 'Autenticación', 'Back-End'],
          titulo: 'Implementar Login y Registro de Usuarios',
          puntos: 5,
          progreso: { done: 0, total: 17 },
          owner: 'JP',
        },
        {
          id: 'HU02',
          tags: ['Prioridad Alta', 'Autenticación', 'Seguridad'],
          titulo: 'Restablecer Contraseña desde Enlace de Recuperación',
          puntos: 5,
          progreso: { done: 0, total: 17 },
          owner: 'MG',
        },
        {
          id: 'HU03',
          tags: ['Front-End', 'Navegación', 'Prioridad Alta'],
          titulo: 'Menú Lateral interactivo y Navegacion en la Aplicación',
          puntos: 6,
          progreso: { done: 0, total: 17 },
          owner: 'AM',
        },
      ],
    },
    {
      id: 'col-2',
      titulo: 'PB-M1(Arquitectura)',
      cards: [
        {
          id: 'HU01',
          tags: ['Prioridad Alta', 'Autenticación', 'Seguridad'],
          titulo: 'Implementar Sistema de Autenticacion JWT',
          puntos: 6,
          progreso: { done: 0, total: 14 },
          owner: 'AM',
        },
        {
          id: 'HU02',
          tags: ['Back-End', 'Roles', 'Permisos'],
          titulo: 'Implementar Sistema de Roles y Permisos',
          puntos: 8,
          progreso: { done: 0, total: 14 },
          owner: 'LR',
        },
        {
          id: 'HU01',
          tags: ['Back-End', 'Autenticación'],
          titulo: 'Implementar Verificacion de Email',
          puntos: 6,
          progreso: { done: 0, total: 14 },
          owner: 'AM',
        },
      ],
    },
    {
      id: 'col-3',
      titulo: 'PB_M2(Usuarios)',
      cards: [
        {
          id: 'HU01',
          tags: ['Prioridad Alta', 'Base de Datos', 'Seguridad'],
          titulo: 'Gestion de Usuarios: CRUD Completo',
          puntos: 6,
          progreso: { done: 0, total: 17 },
          owner: 'AM',
        },
        {
          id: 'HU02',
          tags: ['Front-End', 'Perfil', 'Diseño'],
          titulo: 'Gestion y Edicion de Perfil de Usuario',
          puntos: 5,
          progreso: { done: 0, total: 17 },
          owner: 'PS',
        },
        {
          id: 'HU01',
          tags: ['Front-End', 'Autenticación'],
          titulo: 'Cambio de Contraseña',
          puntos: 6,
          progreso: { done: 0, total: 17 },
          owner: 'VR',
        },
      ],
    },
    {
      id: 'col-4',
      titulo: 'PB_M3(Tareas)',
      cards: [
        {
          id: 'HU01',
          tags: ['Verificación', 'Back-End'],
          titulo: 'Verificacion de Email',
          puntos: 5,
          progreso: { done: 0, total: 17 },
          owner: 'JP',
        },
      ],
    },
  ]
  return Promise.resolve(columns)
}

export function getMembers() {
  return Promise.resolve([
    { id: 'u1', iniciales: 'JM', color: 'bg-rose-500' },
    { id: 'u2', iniciales: 'HC', color: 'bg-sky-500' },
    { id: 'u3', iniciales: 'GA', color: 'bg-emerald-500' },
    { id: 'u4', iniciales: 'M', color: 'bg-violet-500' },
    { id: 'u5', iniciales: 'AM', color: 'bg-orange-500' },
  ])
}
