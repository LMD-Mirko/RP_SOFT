// Datos simulados de postulantes
export const applicants = [
  {
    id: 'a1',
    nombre: 'Juan Perez Garcia',
    estado: 'Pendiente',
    etapa: 'Formulario Enviado',
    correo: '1234567@senati.pe',
    carrera: 'Desarrollo de Software',
    ciclo: 3,
    fechaPostulacion: '2025-02-16 14:30',
  },
  {
    id: 'a2',
    nombre: 'Maria Gonzales Lopez',
    estado: 'Pendiente',
    etapa: 'Prueba Técnica',
    correo: '4789654@senati.pe',
    carrera: 'Desarrollo de Software',
    ciclo: 4,
    fechaPostulacion: '2025-02-16 09:15',
  },
  {
    id: 'a3',
    nombre: 'Carlos Ramirez',
    estado: 'En Prueba',
    etapa: 'Prueba Técnica',
    correo: 'c.ramirez@senati.pe',
    carrera: 'Redes y Comunicaciones',
    ciclo: 5,
    fechaPostulacion: '2025-02-15 16:10',
  },
  {
    id: 'a4',
    nombre: 'Lucia Torres',
    estado: 'Aprobado',
    etapa: 'Entrevista',
    correo: 'l.torres@senati.pe',
    carrera: 'Desarrollo de Software',
    ciclo: 6,
    fechaPostulacion: '2025-02-14 11:45',
  },
]

export function getApplicants() {
  return Promise.resolve([...applicants])
}

export function getStages() {
  return Promise.resolve(['Todas las etapas', 'Formulario Enviado', 'Prueba Técnica', 'Entrevista'])
}

export function getStatuses() {
  return Promise.resolve(['Todos los Estados', 'Pendiente', 'En Prueba', 'Aprobado'])
}
