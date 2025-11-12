/**
 * Router del Módulo Evaluación 360
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { EventosEvaluacionPage } from '../modules/eventos-evaluacion/pages'
import { Evaluacion360Page } from '../modules/evaluacion-360/pages'
import { EvaluacionIndividualPage } from '../modules/evaluacion-individual/pages'
import { EvaluacionTecnicaPage } from '../modules/evaluacion-tecnica/pages'

/**
 * Router del Módulo
 * Layout envuelve todas las rutas para mantener el sidebar visible.
 */
export function ModuleRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<EventosEvaluacionPage />} />
        
        {/* Rutas de Evaluaciones */}
        <Route
          path="eventos-evaluacion"
          element={<EventosEvaluacionPage />}
        />
        <Route
          path="evaluacion-360"
          element={<Evaluacion360Page />}
        />
        <Route
          path="evaluacion-individual"
          element={<EvaluacionIndividualPage />}
        />
        <Route
          path="evaluacion-tecnica"
          element={<EvaluacionTecnicaPage />}
        />
      </Route>
    </Routes>
  )
}

