import { Routes, Route } from 'react-router-dom'
import { EvaluacionPage } from '../pages/EvaluacionPage'
import { ResultadosEvaluacionPage } from '../pages/ResultadosEvaluacionPage'
import { MisEvaluacionesPage } from '../pages/MisEvaluacionesPage'

/**
 * Router para las evaluaciones de postulantes
 */
export function EvaluacionesPostulanteRouter() {
  return (
    <Routes>
      <Route path="mis-evaluaciones" element={<MisEvaluacionesPage />} />
      <Route path=":evaluationId/completar" element={<EvaluacionPage />} />
      <Route path=":evaluationId/resultados" element={<ResultadosEvaluacionPage />} />
    </Routes>
  )
}

