// Test para verificar la transformación de datos
import { transformToBackend } from '../utils/dataAdapter.js'

// Simular datos del formulario del frontend
const testFormData = {
    nombre: 'Juan Pérez García',
    email: 'juan.perez@rpsoft.com',
    equipo: 'Team Alpha',
    servidor: 'rpsoft',
    estado: 'activo',
    color: '#3b82f6'
}

console.log('====== TEST DE TRANSFORMACIÓN DE DATOS ======')
console.log('\nDatos del Formulario (Frontend):')
console.log(JSON.stringify(testFormData, null, 2))

const backendData = transformToBackend(testFormData)

console.log('\nDatos Transformados (Backend):')
console.log(JSON.stringify(backendData, null, 2))

console.log('\n✅ Campos enviados al backend:')
console.log('- nombre:', backendData.nombre)
console.log('- apellido:', backendData.apellido)
console.log('- correo:', backendData.correo)
console.log('- estado:', backendData.estado)
console.log('- semestre:', backendData.semestre)
