/**
 * Router del Módulo Selección Practicantes
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Dashboard } from '../pages/Dashboard'
import { ConvocatoriasPage } from '../modules/convocatorias/pages'
import { PostulantesPage } from '../modules/postulantes/pages'
import { CVsPage } from '../modules/cv/pages'
import { CalendarioPage } from '../modules/Calendario/pages'
import { EvaluacionesPage } from '../modules/gest.. evaluaciones/pages'
import { HistorialPage } from '../modules/historial/pages'
import { PostulacionPage } from '../pages/PostulacionPage'

/**
 * Router del Módulo
 * Layout envuelve todas las rutas para mantener el sidebar visible.
 * Las rutas se implementarán gradualmente según se desarrollen las vistas.
 */
export function ModuleRouter() {
  return (
    <Routes>
      {/* Ruta pública de postulación (sin Layout) */}
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
          path="postulantes"
          element={<PostulantesPage />}
        />
        <Route
          path="cvs"
          element={<CVsPage />}
        />
        
        {/* Rutas de Gestión */}
        <Route
          path="evaluaciones"
          element={<EvaluacionesPage />}
        />
        <Route
          path="calendario"
          element={<CalendarioPage />}
        />
        <Route
          path="historial"
          element={<HistorialPage />}
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