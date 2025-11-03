import { Routes, Route } from 'react-router-dom'

function DashboardGestionTareas() {
  return <div className="text-lg font-semibold">Dashboard Gestión Tareas</div>
}

export function GestionTareasIndex() {
  return (
    <Routes>
      <Route index element={<DashboardGestionTareas />} />
    </Routes>
  )
}

