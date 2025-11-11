/**
 * Router Principal
 * Define las rutas de la aplicación con lazy loading para optimizar la carga inicial.
 */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@shared/components/Layout/MainLayout'

// Lazy loading de páginas de autenticación
const LoginPage = lazy(() =>
  import('@features/seleccion-practicantes/modules/auth/pages').then((m) => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('@features/seleccion-practicantes/modules/auth/pages').then((m) => ({ default: m.RegisterPage }))
)
const OAuthCallbackPage = lazy(() =>
  import('@features/seleccion-practicantes/modules/auth/pages').then((m) => ({ default: m.OAuthCallbackPage }))
)
const ForgotPasswordPage = lazy(() =>
  import('@features/seleccion-practicantes/modules/auth/pages').then((m) => ({ default: m.ForgotPasswordPage }))
)
const ResetPasswordPage = lazy(() =>
  import('@features/seleccion-practicantes/modules/auth/pages').then((m) => ({ default: m.ResetPasswordPage }))
)

// Lazy loading de módulos - se cargan bajo demanda
const SeleccionPracticantesIndex = lazy(() =>
  import('@features/seleccion-practicantes').then((m) => ({ default: m.SeleccionPracticantesIndex }))
)

const TranscripcionReunionesIndex = lazy(() =>
  import('@features/transcripcion-reuniones').then((m) => ({ default: m.TranscripcionReunionesIndex }))
)

const GestionTareasIndex = lazy(() =>
  import('@features/gestion-tareas').then((m) => ({ default: m.GestionTareasIndex }))
)

const AsistenciaHorarioIndex = lazy(() =>
  import('@features/asistencia-horario').then((m) => ({ default: m.AsistenciaHorarioIndex }))
)

const Evaluacion360Index = lazy(() =>
  import('@features/evaluacion-360').then((m) => ({ default: m.Evaluacion360Index }))
)

const DatasetTranscripcionIndex = lazy(() =>
  import('@features/dataset-transcripcion').then((m) => ({ default: m.DatasetTranscripcionIndex }))
)

const AgenteIntegradorIndex = lazy(() =>
  import('@features/agente-integrador').then((m) => ({ default: m.AgenteIntegradorIndex }))
)

const ConveniosConstanciasIndex = lazy(() =>
  import('@features/convenios-constancias').then((m) => ({ default: m.ConveniosConstanciasIndex }))
)

// Lazy loading del Dashboard
const DashboardPage = lazy(() =>
  import('@features/seleccion-practicantes/modules/dashboard/pages').then((m) => ({ default: m.DashboardPage }))
)

// Placeholders
const Configuracion = () => null

/**
 * Router Principal
 * MainLayout muestra el sidebar solo en dashboard y configuración.
 * Los módulos renderizan su propio layout interno.
 */
export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas de autenticación (sin Layout) */}
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={null}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <Suspense fallback={null}>
              <OAuthCallbackPage />
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={null}>
              <ForgotPasswordPage />
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={null}>
              <ResetPasswordPage />
            </Suspense>
          }
        />

        {/* Rutas con Layout (requieren autenticación) */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={null}>
                <DashboardPage />
              </Suspense>
            }
          />

          <Route
            path="/seleccion-practicantes/*"
            element={
              <Suspense fallback={null}>
                <SeleccionPracticantesIndex />
              </Suspense>
            }
          />
          <Route
            path="/transcripcion-reuniones/*"
            element={
              <Suspense fallback={null}>
                <TranscripcionReunionesIndex />
              </Suspense>
            }
          />
          <Route
            path="/gestion-tareas/*"
            element={
              <Suspense fallback={null}>
                <GestionTareasIndex />
              </Suspense>
            }
          />
          <Route
            path="/asistencia-horario/*"
            element={
              <Suspense fallback={null}>
                <AsistenciaHorarioIndex />
              </Suspense>
            }
          />
          <Route
            path="/evaluacion-360/*"
            element={
              <Suspense fallback={null}>
                <Evaluacion360Index />
              </Suspense>
            }
          />
          <Route
            path="/dataset-transcripcion/*"
            element={
              <Suspense fallback={null}>
                <DatasetTranscripcionIndex />
              </Suspense>
            }
          />
          <Route
            path="/agente-integrador/*"
            element={
              <Suspense fallback={null}>
                <AgenteIntegradorIndex />
              </Suspense>
            }
          />
          <Route
            path="/convenios-constancias/*"
            element={
              <Suspense fallback={null}>
                <ConveniosConstanciasIndex />
              </Suspense>
            }
          />

          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
