/**
 * Router del Módulo RevisionDocumentos
 * Define las rutas internas del módulo de revisión de documentos.
 */

import { Routes, Route } from 'react-router-dom'
import RevisionDocumentos from '../pages/RevisionDocumentos'

/**
 * Router del Módulo RevisionDocumentos
 * Este módulo es independiente y maneja sus propias rutas.
 */
export function RevisionDocumentosRouter() {
  return (
    <Routes>
      <Route index element={<RevisionDocumentos />} />
      {/* Aquí se pueden agregar más rutas específicas del módulo en el futuro */}
    </Routes>
  )
}
