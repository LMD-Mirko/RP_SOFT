/**
 * Router del Módulo Convenios y Constancias
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Dashboard } from '../modules/Dashboard'
import { Auditoria } from '../modules/auditoria'
import { Configuracion } from '../modules/configuracion'
import { RevisionDocumentos } from '../modules/RevisionDocumentos'
import { UsuarioConvenio } from '../modules/usuario/convenio/pages/convenio'
import { UsuarioConstancias } from '../modules/usuario/constancias/pages/constancias'

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
          element={<RevisionDocumentos />}
        />
        <Route
          path="auditoria"
          element={<Auditoria />}
        />
        <Route
          path="configuracion"
          element={<Configuracion />}
        />
        <Route
          path="usuario/convenio"
          element={<UsuarioConvenio />}
        />
        <Route
          path="usuario/constancias"
          element={<UsuarioConstancias />}
        />
      </Route>
    </Routes>
  )
}

