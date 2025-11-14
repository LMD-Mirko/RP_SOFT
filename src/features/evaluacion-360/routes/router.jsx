/**
 * Router del Módulo Evaluación 360
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { EventosEvaluacionPage } from '../modules/eventos-evaluacion/pages'
import { Evaluacion360Page } from '../modules/evaluacion-360/pages'
import { EvaluacionTecnicaPage } from '../modules/evaluacion-tecnica/pages'
import { Evaluacion360UsuarioPage } from '../modules/evaluacion-360-usuario/pages'
import { Nota360UsuarioPage } from '../modules/nota-360-usuario/pages'

/**
 * Router del Módulo
 * Layout envuelve todas las rutas para mantener el sidebar visible.
 */
export function ModuleRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<EventosEvaluacionPage />} />
        
        {/* Rutas de Admin */}
        <Route
          path="eventos-evaluacion"
          element={<EventosEvaluacionPage />}
        />
        <Route
          path="evaluacion-360"
          element={<Evaluacion360Page />}
        />
        <Route
          path="evaluacion-tecnica"
          element={<EvaluacionTecnicaPage />}
        />
        
        {/* Rutas de Usuario */}
        <Route
          path="usuario/evaluacion-360"
          element={<Evaluacion360UsuarioPage />}
        />
        <Route
          path="usuario/nota-360"
          element={<Nota360UsuarioPage />}
        />
      </Route>
    </Routes>
  )
}

