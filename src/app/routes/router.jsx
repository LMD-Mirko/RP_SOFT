/**
 * Router Principal
 * Define las rutas de la aplicación con lazy loading para optimizar la carga inicial.
 */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@shared/components/Layout/MainLayout'

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

const ConveniosConstanciasIndex = lazy(() =>
  import('@features/convenios-constancias').then((m) => ({ default: m.ConveniosConstanciasIndex }))
)



// Placeholders
const Dashboard = () => null
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
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />

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
