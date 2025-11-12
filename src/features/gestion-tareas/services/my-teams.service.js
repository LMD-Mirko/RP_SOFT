let TEAMS = [
  {
    id: 'team-a',
    nombre: 'Equipo A - Frontend',
    descripcion: 'Equipo especializado en desarrollo frontend con React y TypeScript',
    miembros: ['Juan', 'Carlos', 'Miguel'],
    totalMiembros: 3,
    totalTareas: 3,
    progreso: 0,
  },
  {
    id: 'team-b',
    nombre: 'Equipo B - Backend',
    descripcion: 'Equipo de desarrollo backend con Node.js, Python y bases de datos',
    miembros: ['María', 'Ana', 'Roberto'],
    totalMiembros: 3,
    totalTareas: 3,
    progreso: 50,
  },
  {
    id: 'team-c',
    nombre: 'Equipo C - Diseño',
    descripcion: 'Equipo de diseño UI/UX especializado en experiencia de usuario',
    miembros: ['María', 'Carlos'],
    totalMiembros: 2,
    totalTareas: 2,
    progreso: 100,
  },
]

export function getMyTeams() {
  return Promise.resolve([...TEAMS])
}

export function createTeam(team) {
  const id = 'team-' + Date.now()
  const payload = {
    id,
    ...team,
    miembros: team.miembros || [],
    totalMiembros: (team.miembros || []).length,
  }
  TEAMS = [payload, ...TEAMS]
  return Promise.resolve(payload)
}

export function updateTeam(id, data) {
  TEAMS = TEAMS.map((t) => (t.id === id ? { ...t, ...data, totalMiembros: (data.miembros || t.miembros).length } : t))
  return Promise.resolve(TEAMS.find((t) => t.id === id))
}
