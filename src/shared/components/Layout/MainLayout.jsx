import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@shared/components/Layout/Sidebar'
import { Header } from '@shared/components/Layout/Header'
import { ChatPanel } from '@shared/components/ChatPanel'
import { useChatPanel } from '@shared/context/ChatPanelContext'
import { UserProfileProvider } from '@shared/context/UserProfileContext'

export function MainLayout() {
  const location = useLocation()
  const { isOpen: isChatOpen } = useChatPanel()
  const modulePrefixes = [
    '/configuracion',
    '/seleccion-practicantes',
    '/transcripcion-reuniones',
    '/gestion-tareas',
    '/asistencia-horario',
    '/evaluacion-360',
    '/convenios-constancias',
  ]
  const isModuleRoute =
    location.pathname !== '/' &&
    modulePrefixes.some((prefix) => location.pathname.startsWith(prefix))

  // En módulos (incluye Configuración General): el Layout del módulo maneja Header + Sidebar
  // En dashboard: Header + Sidebar principal aquí
  if (isModuleRoute) {
    return (
      <UserProfileProvider>
        <div className="h-screen bg-gray-50">
          <Outlet />
        </div>
      </UserProfileProvider>
    )
  }

  // Dashboard y configuración: Header + Sidebar principal
  return (
    <UserProfileProvider>
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
    </UserProfileProvider>
  )
}
