import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@shared/components/Layout/Sidebar'
import { Header } from '@shared/components/Layout/Header'
import { ChatPanel } from '@shared/components/ChatPanel'
import { useChatPanel } from '@shared/context/ChatPanelContext'

export function MainLayout() {
  const location = useLocation()
  const { isOpen: isChatOpen } = useChatPanel()
  const isModuleRoute = location.pathname !== '/' && 
    !location.pathname.startsWith('/configuracion') &&
    !location.pathname.startsWith('/directorio-practicantes') &&
    (location.pathname.startsWith('/seleccion-practicantes') ||
     location.pathname.startsWith('/transcripcion-reuniones') ||
     location.pathname.startsWith('/gestion-tareas') ||
     location.pathname.startsWith('/asistencia-horario') ||
     location.pathname.startsWith('/evaluacion-360') ||
     location.pathname.startsWith('/convenios-constancias'))

  // En módulos: el Layout del módulo incluye Header + Sidebar
  // En dashboard/configuración: Header + Sidebar principal aquí
  if (isModuleRoute) {
    return (
      <div className="h-screen bg-gray-50">
        <Outlet />
      </div>
    )
  }

  // Dashboard y configuración: Header + Sidebar principal
  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {isChatOpen ? (
          <ChatPanel />
        ) : (
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  )
}
