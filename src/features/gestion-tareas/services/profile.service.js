let PROFILE = {
  nombre: 'Juan Perez',
  email: 'juan.perez@gmail.com',
  telefono: '999 999 999',
  carrera: 'Ingeniería de Software con IA',
  rol: 'Frontend',
}

export function getProfile() {
  return Promise.resolve({ ...PROFILE })
}

export function updateProfile(data) {
  PROFILE = { ...PROFILE, ...data }
  return Promise.resolve({ ...PROFILE })
}

export function changePassword({ actual, nueva }) {
  // Mock: aceptar siempre si hay datos
  if (!actual || !nueva) {
    return Promise.reject(new Error('Datos incompletos'))
  }
  return Promise.resolve({ ok: true })
}
