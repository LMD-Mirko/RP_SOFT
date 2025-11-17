import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import { Header } from '@shared/components/Layout/Header'
import { ChatbotWidget } from '../ChatbotWidget'

export function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <ChatbotWidget />
      </div>
    </div>
  )
}

