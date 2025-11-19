// src/features/seleccion-practicantes/routes/router.jsx

/**
 * Router del Módulo Selección Practicantes
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Dashboard } from '../pages/Dashboard'
import { ConvocatoriasPage, GestionEncuestasPage, GestionPreguntasPage } from '../modules/convocatorias/pages'
import { PostulantesPage } from '../modules/postulantes/pages'
import { CVsPage } from '../modules/cv/pages'
import { CVsAdminPage } from '../modules/cvs-admin/pages'
import { CalendarioPage } from '../modules/Calendario/pages'
import { EvaluacionesRouter } from '../modules/gest.. evaluaciones/routes/EvaluacionesRouter'
import { EvaluacionPage, ResultadosEvaluacionPage, MisEvaluacionesPage } from '../modules/evaluaciones-postulante/pages'
import { HistorialPage } from '../modules/historial/pages'
import { PostulacionPage } from '../modules/Practicante-Form/pages'
import { SeleccionarConvocatoriaPage } from '../modules/Practicante-Form/pages/SeleccionarConvocatoriaPage'
import { EspecialidadesPage } from '../modules/especialidades/pages'
import { RequireRole } from './RequireRole'
import { TranscripcionesPage } from '@features/transcripcion-reuniones'

/**
 * Router del Módulo
 * Layout envuelve todas las rutas para mantener el sidebar visible.
 * Las rutas se implementarán gradualmente según se desarrollen las vistas.
 */
export function ModuleRouter() {
  return (
    <Routes>
      {/* Rutas públicas de postulación (sin Layout) */}
      <Route path="seleccionar-convocatoria" element={<SeleccionarConvocatoriaPage />} />
      <Route path="postulacion" element={<PostulacionPage />} />
      
      {/* Rutas con Layout (requieren autenticación) */}
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        
        {/* Rutas de Reclutamiento */}
        <Route
          path="convocatorias"
          element={<ConvocatoriasPage />}
        />
        <Route
          path="convocatorias/:jobPostingId/encuestas"
          element={
            <RequireRole requireAdmin={true}>
              <GestionEncuestasPage />
            </RequireRole>
          }
        />
        <Route
          path="convocatorias/:jobPostingId/encuestas/:evaluationType"
          element={
            <RequireRole requireAdmin={true}>
              <GestionPreguntasPage />
            </RequireRole>
          }
        />
        <Route
          path="postulantes"
          element={<PostulantesPage />}
        />
        <Route
          path="cvs"
          element={<CVsPage />}
        />
        <Route
          path="cvs-admin"
          element={
            <RequireRole requireAdmin={true}>
              <CVsAdminPage />
            </RequireRole>
          }
        />
        
        {/* Rutas de Evaluaciones para Postulantes (deben ir antes del wildcard) */}
        <Route
          path="evaluaciones/mis-evaluaciones"
          element={<MisEvaluacionesPage />}
        />
        <Route
          path="evaluaciones/:evaluationId/completar"
          element={<EvaluacionPage />}
        />
        <Route
          path="evaluaciones/:evaluationId/resultados"
          element={<ResultadosEvaluacionPage />}
        />
        
        {/* Rutas de Gestión de Evaluaciones (Admin) */}
        <Route
          path="evaluaciones/*"
          element={
            <RequireRole requireAdmin={true}>
              <EvaluacionesRouter />
            </RequireRole>
          }
        />
        <Route
          path="calendario"
          element={<CalendarioPage />}
        />
        <Route
          path="historial"
          element={<HistorialPage />}
        />
        <Route
          path="especialidades"
          element={
            <RequireRole requireAdmin={true}>
              <EspecialidadesPage />
            </RequireRole>
          }
        />
        {/* Transcripción: enlaza a la vista del módulo transcripcion-reuniones */}
        <Route
          path="transcripciones"
          element={<TranscripcionesPage />}
        />
        <Route
          path="configuracion"
          element={<div><h2>Configuración</h2></div>}
        />
      </Route>
    </Routes>
  )
}