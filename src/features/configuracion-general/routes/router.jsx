import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { PlaceholderSection } from '../pages/PlaceholderSection'
import { RolesPage, PerfilPage, UsuariosPage, TiposDocumentoPage } from '../modules'

export function ModuleRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="global/general" replace />} />

        <Route
          path="global/general"
          element={
            <PlaceholderSection
              title="Configuración general"
              description="Administra la información base del sistema."
            />
          }
        />
        <Route path="global/usuarios" element={<UsuariosPage />} />
        <Route
          path="global/roles"
          element={<RolesPage />}
        />
        <Route
          path="global/especialidades"
          element={
            <PlaceholderSection
              title="Especialidades"
              description="Mantén actualizada la lista de especialidades disponibles."
            />
          }
        />
        <Route
          path="global/tipos-documento"
          element={<TiposDocumentoPage />}
        />
        <Route
          path="global/perfil"
          element={<PerfilPage />}
        />

        <Route path="*" element={<Navigate to="global/general" replace />} />
      </Route>
    </Routes>
  )
}

