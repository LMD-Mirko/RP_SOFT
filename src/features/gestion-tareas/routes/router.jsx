/**
 * Router del Módulo Gestión de Tareas
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
        
        {/* Rutas de Gestión de Tareas */}
        <Route
          path="backlog"
          element={<div><h2>Backlog del Producto</h2></div>}
        />
        <Route
          path="sprint-board"
          element={<div><h2>Sprint Board</h2></div>}
        />
        <Route
          path="historias"
          element={<div><h2>Repo. de Historias</h2></div>}
        />
        <Route
          path="metricas"
          element={<div><h2>Métricas</h2></div>}
        />
      </Route>
    </Routes>
  )
}

