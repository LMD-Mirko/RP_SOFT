/**
 * Router del Módulo Asistencia & Horario
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Dashboard } from '../pages/Dashboard'
import { Dashboard as PracticantesDashboard } from '../modules/practicantes/pages/Dashboard'
import { PerfilPracticante } from '../modules/practicantes/pages/PerfilPracticante'

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
        
        {/* Rutas de Monitoreo */}
        <Route
          path="bot-integracion"
          element={<div><h2>Bot de Integración</h2></div>}
        />
        
        {/* Rutas de Asistencia */}
        <Route
          path="puntualidad"
          element={<div><h2>Puntualidad</h2></div>}
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
          path="reforzamiento"
          element={<div><h2>Reforzamiento</h2></div>}
        />
        <Route
          path="historial-practicantes"
          element={<div><h2>Historial de Practicantes</h2></div>}
        />
        
        {/* Rutas de Practicante */}
        <Route
          path="practicante/inicio"
          element={<div><h2>Inicio - Practicante</h2></div>}
        />
        <Route
          path="practicante/mi-asistencia"
          element={<div><h2>Mi Asistencia</h2></div>}
        />
        <Route
          path="practicante/mi-horario"
          element={<DisciplinaryTrackingView />}
        />
      </Route>
    </Routes>
  )
}

