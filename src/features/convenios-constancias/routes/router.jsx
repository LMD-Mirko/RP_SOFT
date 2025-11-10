/**
 * Router del Módulo Convenios y Constancias
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Dashboard } from '../modules/dashboard/pages'
import { AuditoriaPage } from '../modules/auditoria/pages'
import { ConfiguracionPage } from '../modules/configuracion/pages'
import { RevisionDocumentosPage } from '../modules/revisiondocumentos/pages'

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
        
        {/* Rutas de Convenios y Constancias */}
        <Route
          path="revision-documentos"
          element={<RevisionDocumentosPage />}
        />
        <Route
          path="auditoria"
          element={<AuditoriaPage />}
        />
        <Route
          path="configuracion"
          element={<ConfiguracionPage />}
        />
      </Route>
    </Routes>
  )
}

