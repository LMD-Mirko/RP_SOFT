import { Routes, Route } from 'react-router-dom'

function DashboardAsistenciaHorario() {
  return <div className="text-lg font-semibold">Dashboard Asistencia & Horario</div>
}

export function AsistenciaHorarioIndex() {
  return (
    <Routes>
      <Route index element={<DashboardAsistenciaHorario />} />
    </Routes>
  )
}

