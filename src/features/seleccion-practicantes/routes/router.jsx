// src/features/seleccion-practicantes/routes/router.jsx

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
import { CVsAdminPage } from '../modules/cvs-admin/pages'
import { CalendarioPage } from '../modules/Calendario/pages'
import { EvaluacionesPage } from '../modules/gest.. evaluaciones/pages'
import { HistorialPage } from '../modules/historial/pages'
import { PostulacionPage } from '../modules/Practicante-Form/pages'
import { PerfilPage } from '../modules/perfil/pages'
import { UsuariosPage } from '../modules/usuarios/pages'
import { RolesPage } from '../modules/roles/pages'
import { EspecialidadesPage } from '../modules/especialidades/pages'
import { TiposDocumentoPage } from '../modules/tipos-documento/pages'
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
        <Route
          path="cvs-admin"
          element={
            <RequireRole requireAdmin={true}>
              <CVsAdminPage />
            </RequireRole>
          }
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
        <Route
          path="usuarios"
          element={
            <RequireRole requireAdmin={true}>
              <UsuariosPage />
            </RequireRole>
          }
        />
        <Route
          path="roles"
          element={
            <RequireRole requireAdmin={true}>
              <RolesPage />
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
        <Route
          path="tipos-documento"
          element={
            <RequireRole requireAdmin={true}>
              <TiposDocumentoPage />
            </RequireRole>
          }
        />
        {/* Transcripción: enlaza a la vista del módulo transcripcion-reuniones */}
        <Route
          path="transcripciones"
          element={<TranscripcionesPage />}
        />
        
        {/* Rutas de Cuenta */}
        <Route
          path="perfil"
          element={<PerfilPage />}
        />
        <Route
          path="configuracion"
          element={<div><h2>Configuración</h2></div>}
        />
      </Route>
      
    </Routes>
  )
}