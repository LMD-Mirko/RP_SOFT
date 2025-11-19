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
import { GestionExamenPage, RealizarExamenPage, ExamenesPage, ExamenesAsignadosPage, ExamParticipantsPage } from '../modules/examenes/pages'
import { RequireRole } from './RequireRole'
import { RequirePostulante } from './RequirePostulante'
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
        
        {/* Rutas de Reclutamiento - Solo Admin */}
        <Route
          path="convocatorias"
          element={
            <RequireRole requireAdmin={true}>
              <ConvocatoriasPage />
            </RequireRole>
          }
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
          element={
            <RequireRole requireAdmin={true}>
              <PostulantesPage />
            </RequireRole>
          }
        />
        {/* Ver CV/s - Solo Postulante */}
        <Route
          path="cvs"
          element={
            <RequirePostulante>
              <CVsPage />
            </RequirePostulante>
          }
        />
        <Route
          path="cvs-admin"
          element={
            <RequireRole requireAdmin={true}>
              <CVsAdminPage />
            </RequireRole>
          }
        />
        
        {/* Rutas de Evaluaciones para Postulantes (deben ir antes del wildcard) - Solo Postulante */}
        <Route
          path="evaluaciones/mis-evaluaciones"
          element={
            <RequirePostulante>
              <MisEvaluacionesPage />
            </RequirePostulante>
          }
        />
        <Route
          path="evaluaciones/:evaluationId/completar"
          element={
            <RequirePostulante>
              <EvaluacionPage />
            </RequirePostulante>
          }
        />
        <Route
          path="evaluaciones/:evaluationId/resultados"
          element={
            <RequirePostulante>
              <ResultadosEvaluacionPage />
            </RequirePostulante>
          }
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
        {/* Calendario - Solo Admin */}
        <Route
          path="calendario"
          element={
            <RequireRole requireAdmin={true}>
              <CalendarioPage />
            </RequireRole>
          }
        />
        {/* Historial - Solo Admin */}
        <Route
          path="historial"
          element={
            <RequireRole requireAdmin={true}>
              <HistorialPage />
            </RequireRole>
          }
        />
        <Route
          path="especialidades"
          element={
            <RequireRole requireAdmin={true}>
              <EspecialidadesPage />
            </RequireRole>
          }
        />
        {/* Rutas de Exámenes */}
        <Route
          path="examenes"
          element={
            <RequireRole requireAdmin={true}>
              <ExamenesPage />
            </RequireRole>
          }
        />
        <Route
          path="examenes/:examId/gestionar"
          element={
            <RequireRole requireAdmin={true}>
              <GestionExamenPage />
            </RequireRole>
          }
        />
        <Route
          path="examenes/:examId/participantes"
          element={
            <RequireRole requireAdmin={true}>
              <ExamParticipantsPage />
            </RequireRole>
          }
        />
        <Route
          path="examenes/:examId/realizar"
          element={<RealizarExamenPage />}
        />
        <Route
          path="examenes/asignados"
          element={<ExamenesAsignadosPage />}
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