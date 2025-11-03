/**
 * Router del Módulo Selección Practicantes
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
        
        {/* Rutas de Reclutamiento */}
        <Route
          path="convocatorias"
          element={<div><h2>Convocatorias</h2></div>}
        />
        <Route
          path="postulantes"
          element={<div><h2>Postulantes</h2></div>}
        />
        <Route
          path="cvs"
          element={<div><h2>Ver CV/s</h2></div>}
        />
        
        {/* Rutas de Gestión */}
        <Route
          path="evaluaciones"
          element={<div><h2>Evaluaciones</h2></div>}
        />
        <Route
          path="calendario"
          element={<div><h2>Calendario</h2></div>}
        />
        <Route
          path="historial"
          element={<div><h2>Historial</h2></div>}
        />
        
        {/* Rutas de Cuenta */}
        <Route
          path="configuracion"
          element={<div><h2>Configuración</h2></div>}
        />
      </Route>
    </Routes>
  )
}
