import { Routes, Route } from 'react-router-dom'
import ConfigPanel from './pages/ConfigPanel'
import ModuleLoader from './pages/ModuleLoader'
import SystemPanel from './pages/SystemPanel'
import UserPanel from './pages/UserPanel'

const MODULE_ROUTES = [
  { path: 'asistencia', title: 'Asistencia' },
  { path: 'tareas', title: 'Gestión de Tareas' },
  { path: 'practicantes', title: 'Selección de Practicantes' },
  { path: 'sesiones', title: 'Transcripción de Sesiones' },
  { path: 'conversacion', title: 'Conversación y Asistencias' },
  { path: 'evaluacion', title: 'Sistema de Evaluación' },
  { path: 'ayuda', title: 'Centro de Ayuda' },
  { path: 'modulo', title: 'Módulo' },
]

export function AgenteIntegradorIndex() {
  return (
    <Routes>
      <Route index element={<SystemPanel />} />
      <Route path="sistema" element={<SystemPanel />} />
      <Route path="user" element={<UserPanel />} />
      <Route path="admin" element={<ConfigPanel />} />

      {MODULE_ROUTES.map(({ path, title }) => (
        <Route
          key={path}
          path={path}
          element={<ModuleLoader title={title} />}
        />
      ))}
    </Routes>
  )
}