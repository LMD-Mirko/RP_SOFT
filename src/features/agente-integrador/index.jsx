import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import RoleGate from './pages/RoleGate'
import ConfigPanel from './pages/ConfigPanel'
import ModuleLoader from './pages/ModuleLoader'
import SystemPanel from './pages/SystemPanel'
import UserPanel from './pages/UserPanel'

import { GeminiProvider } from './context/GeminiContext'
import { AuthProvider } from './context/AuthContext'

import './styles/app.css'
import './styles/chat.css'
import './styles/history.css'

const MODULE_ROUTES = [
  { path: 'asistencia', title: 'Asistencia' },
  { path: 'tareas', title: 'Gestión de Tareas' },
  { path: 'practicantes', title: 'Selección de Practicantes' },
  { path: 'sesiones', title: 'Transcripción de Sesiones' },
  { path: 'conversacion', title: 'Conversación y Asistencias' },
  { path: 'evaluacion', title: 'Sistema de Evaluación' },
  { path: 'ayuda', title: 'Centro de Ayuda' },
  { path: 'modulo', title: 'Módulo' }
]

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('❌ ErrorBoundary atrapó un error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
          <h2>⚠️ Se produjo un error al renderizar</h2>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f6f8fa',
              padding: 12,
              borderRadius: 8
            }}
          >
            {String(this.state.error)}
          </pre>
          <p>Revisa la consola (F12 → Console) y confirma qué import falló.</p>
        </div>
      )
    }
    return this.props.children
  }
}

function AgenteIntegradorRoutes() {
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

export function AgenteIntegradorIndex() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <GeminiProvider>
          <Router>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<RoleGate />} />
                <Route path="/*" element={<AgenteIntegradorRoutes />} />
                <Route
                  path="/debug"
                  element={<div style={{ padding: 24 }}>✅ Router y render OK</div>}
                />
              </Routes>
            </ErrorBoundary>
          </Router>
        </GeminiProvider>
      </AuthProvider>
    </React.StrictMode>
  )
}

export default AgenteIntegradorIndex