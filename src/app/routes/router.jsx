/**
 * Router Principal
 * Define las rutas de la aplicación.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@shared/components/Layout/MainLayout'
import ErrorBoundary from '@shared/components/ErrorBoundary'
import Error404 from '@shared/interfaces/Error404'

// Importaciones directas de páginas de autenticación
import {
  LoginPage,
  RegisterPage,
  OAuthCallbackPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  RegisterAdminPage
} from '@features/seleccion-practicantes/modules/auth/pages'

// Importaciones directas de módulos
import { SeleccionPracticantesIndex } from '@features/seleccion-practicantes'
import { TranscripcionReunionesIndex } from '@features/transcripcion-reuniones'
import { GestionTareasIndex } from '@features/gestion-tareas'
import { AsistenciaHorarioIndex } from '@features/asistencia-horario'
import { Evaluacion360Index } from '@features/evaluacion-360'
import { ConveniosConstanciasIndex } from '@features/convenios-constancias'
import { ConfiguracionGeneralIndex } from '@features/configuracion-general'

// Importación directa del Dashboard
import { DashboardPage } from '@features/seleccion-practicantes/modules/dashboard/pages'

/**
 * Router Principal
 * MainLayout muestra el sidebar solo en dashboard y configuración.
 * Los módulos renderizan su propio layout interno.
 */
export function Router() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas de autenticación (sin Layout) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin/register" element={<RegisterAdminPage />} />

          {/* Rutas con Layout (requieren autenticación) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/seleccion-practicantes/*" element={<SeleccionPracticantesIndex />} />
            <Route path="/transcripcion-reuniones/*" element={<TranscripcionReunionesIndex />} />
            <Route path="/gestion-tareas/*" element={<GestionTareasIndex />} />
            <Route path="/asistencia-horario/*" element={<AsistenciaHorarioIndex />} />
            <Route path="/evaluacion-360/*" element={<Evaluacion360Index />} />
            <Route path="/convenios-constancias/*" element={<ConveniosConstanciasIndex />} />
            <Route path="/configuracion/*" element={<ConfiguracionGeneralIndex />} />
          </Route>
          
          {/* Ruta 404 para todas las rutas no encontradas (sin Layout) */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
