import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@shared/components/Layout/Sidebar'

export function MainLayout() {
  const location = useLocation()
  const isModuleRoute = location.pathname !== '/' && 
    !location.pathname.startsWith('/configuracion') &&
    (location.pathname.startsWith('/seleccion-practicantes') ||
     location.pathname.startsWith('/transcripcion-reuniones') ||
     location.pathname.startsWith('/gestion-tareas') ||
     location.pathname.startsWith('/asistencia-horario') ||
     location.pathname.startsWith('/evaluacion-360') ||
     location.pathname.startsWith('/dataset-transcripcion') ||
     location.pathname.startsWith('/agente-integrador') ||
     location.pathname.startsWith('/convenios-constancias'))

  // Si es una ruta de módulo, no mostrar el sidebar principal
  if (isModuleRoute) {
    return (
      <div className="h-screen bg-gray-50">
        <Outlet />
      </div>
    )
  }

  // Para dashboard y configuración, mostrar el sidebar principal
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
