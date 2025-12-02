import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar } from '../Sidebar'
import { Header } from '@shared/components/Layout/Header'

export function Layout() {
  const location = useLocation()
  const key = location.pathname
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    setEntered(false)
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [key])
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div
            key={key}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 200ms ease, transform 200ms ease',
              willChange: 'opacity, transform',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

