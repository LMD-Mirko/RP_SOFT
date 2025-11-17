import { Routes, Route } from 'react-router-dom'
import { ListaEvaluacionesPage } from '../pages/ListaEvaluaciones'
import { GestionarPreguntasPage } from '../pages/GestionarPreguntas'
import { ConfiguracionEvaluacionPage } from '../pages/ConfiguracionEvaluacion'

/**
 * Router interno para las evaluaciones técnicas
 * Maneja las sub-rutas dentro del módulo de evaluaciones
 */
export function EvaluacionesRouter() {
  return (
    <Routes>
      <Route index element={<ListaEvaluacionesPage />} />
      <Route path=":id/preguntas" element={<GestionarPreguntasPage />} />
      <Route path=":id/configuracion" element={<ConfiguracionEvaluacionPage />} />
    </Routes>
  )
}

