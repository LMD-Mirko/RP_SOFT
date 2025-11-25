/**
 * Router del Módulo Asistencia & Horario
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import Error404 from '@shared/interfaces/Error404'
import { Layout } from '../components/Layout'
import { Dashboard as PracticantesDashboard } from '../modules/practicantes/pages/Dashboard'
import { PerfilPracticante } from '../modules/practicantes/pages/PerfilPracticante'
import { Dashboard as GestionHorariosDashboard } from '../modules/gestion-horarios/pages/Dashboard'
import { Reports } from '../modules/reportes/pages/Reports'
import DisciplinaryTrackingView from '../modules/seguimiento-disciplinario/pages/DisciplinaryTrackingView'
import HistorialPracticantes from '../modules/historial-practicantes/pages/HistorialPracticantes'
import ControlAsistencia from '../modules/control-asistencias/pages/ControlAsistencia'
import { Inicio } from '../modules/inicio/pages/nicolayus'
import PuntualidadDashboard from '../modules/puntualidad/pages/PuntualidadDashboard'
import { Botintegrative } from '../modules/bot_integracion/pages/Botintegrative'

/**
 * Router del Módulo
 * Layout envuelve todas las rutas para mantener el sidebar visible.  
 * Las rutas se implementarán gradualmente según se desarrollen las vistas.
 */
export function ModuleRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Botintegrative />} />

        {/* Rutas de Monitoreo */}
        <Route
          path="bot-integracion"
          element={<Botintegrative />}
        />

        {/* Rutas de Asistencia */}
        <Route
          path="puntualidad"
          element={<PuntualidadDashboard />}
        />
        <Route
          path="practicantes"
          element={<PracticantesDashboard />}
        />
        <Route
          path="practicantes/:id"
          element={<PerfilPracticante />}
        />
        <Route
          path="gestion-horarios"
          element={<GestionHorariosDashboard />}
        />

        {/* Rutas de Módulos */}
        <Route
          path="reportes"
          element={<Reports />}
        />
        <Route
          path="historial-practicantes"
          element={<HistorialPracticantes />}
        />

        {/* Rutas de Practicante */}
        <Route
          path="practicante/inicio"
          element={<Inicio />}
        />
        <Route
          path="practicante/mi-asistencia"
          element={<ControlAsistencia />}
        />
        <Route
          path="practicante/mi-horario"
          element={<DisciplinaryTrackingView />}
        />
      </Route>
      
      {/* Ruta 404 para rutas no encontradas (sin Layout) */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  )
}

