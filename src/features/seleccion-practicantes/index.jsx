import { Routes, Route } from 'react-router-dom'

function DashboardSeleccionPracticantes() {
  return <div className="text-lg font-semibold">Dashboard Selección Practicantes</div>
}

export function SeleccionPracticantesIndex() {
  return (
    <Routes>
      <Route index element={<DashboardSeleccionPracticantes />} />
    </Routes>
  )
}

