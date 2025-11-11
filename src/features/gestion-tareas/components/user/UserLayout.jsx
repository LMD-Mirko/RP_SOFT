import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function UserLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const tabs = [
    { to: '/gestion-tareas/usuario/inicio', label: 'Inicio' },
    { to: '/gestion-tareas/usuario/mis-tareas', label: 'Mis Tareas' },
    { to: '/gestion-tareas/usuario/equipo', label: 'Equipo' },
    { to: '/gestion-tareas/usuario/feedback', label: 'Feedback' },
    { to: '/gestion-tareas/usuario/perfil', label: 'Perfil' },
  ]
  const currentTitle = (() => {
    if (location.pathname.includes('/mis-tareas')) return 'Mis Tareas'
    if (location.pathname.includes('/equipo')) return 'Mis Equipos'
    if (location.pathname.includes('/feedback')) return 'Feedback'
    if (location.pathname.includes('/perfil')) return 'Perfil'
    return 'Inicio'
  })()
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate('/gestion-tareas')} className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{currentTitle}</h1>
            <p className="text-gray-600">Gestiona el Proceso completo de Selección de Practicantes Senati</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} className={({ isActive }) => `${isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'} rounded-full border border-gray-200 px-4 h-10 text-sm inline-flex items-center shadow-sm`}>
              {t.label}
            </NavLink>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  )
}
