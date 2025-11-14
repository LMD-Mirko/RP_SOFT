import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import { SidebarUsuario } from '../SidebarUsuario'
import { Header } from '@shared/components/Layout/Header'

export function Layout() {
  const location = useLocation()
  const isUserView = location.pathname.includes('/usuario/')

  return (
    <div className="flex h-screen bg-gray-50">
      {isUserView ? <SidebarUsuario /> : <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

