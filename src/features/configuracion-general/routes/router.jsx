import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { PlaceholderSection } from '../pages/PlaceholderSection'
import { GestionUsuariosPage } from '../modules'

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
        <Route path="global/usuarios" element={<GestionUsuariosPage />} />
        <Route
          path="global/roles"
          element={
            <PlaceholderSection
              title="Roles y permisos"
              description="Define las responsabilidades y capacidades de cada rol."
            />
          }
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
          element={
            <PlaceholderSection
              title="Tipos de documento"
              description="Gestiona los tipos de documento aceptados por la plataforma."
            />
          }
        />
        <Route
          path="global/perfil"
          element={
            <PlaceholderSection
              title="Mi perfil"
              description="Actualiza tu información personal y preferencias de cuenta."
            />
          }
        />

        <Route path="*" element={<Navigate to="global/general" replace />} />
      </Route>
    </Routes>
  )
}

