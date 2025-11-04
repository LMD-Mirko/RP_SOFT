/**
 * Router del Módulo Convenios y Constancias
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Dashboard } from '../pages/Dashboard'

/**
 * Router del Módulo
 * Layout envuelve todas las rutas para mantener el sidebar visible.
 * Las rutas se implementarán gradualmente según se desarrollen las vistas.
 */
export function ModuleRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        
        {/* Rutas de Convenios y Constancias */}
        <Route
          path="revision-documentos"
          element={<div><h2>Revisión de Documentos</h2></div>}
        />
        <Route
          path="auditoria"
          element={<div><h2>Auditoría</h2></div>}
        />
        <Route
          path="configuracion"
          element={<div><h2>Configuración</h2></div>}
        />
      </Route>
    </Routes>
  )
}

