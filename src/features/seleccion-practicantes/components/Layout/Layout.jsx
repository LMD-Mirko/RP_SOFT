import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import { Header } from '@shared/components/Layout/Header'

export function Layout() {
  const location = useLocation()
  
  // Rutas que no deben mostrar el sidebar (Practicante-Form)
  const isPracticanteFormRoute = location.pathname.includes('/practicante-form')
  
  // Si es una ruta de Practicante-Form, renderizar sin sidebar
  if (isPracticanteFormRoute) {
    return (
      <div className="h-screen bg-gray-50">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    )
  }
  
  // Layout normal con sidebar para el resto de rutas
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
