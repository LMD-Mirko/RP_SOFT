import { Routes, Route } from 'react-router-dom'

function DashboardConveniosConstancias() {
  return <div className="text-lg font-semibold">Dashboard Convenios Constancias</div>
}

export function ConveniosConstanciasIndex() {
  return (
    <Routes>
      <Route index element={<DashboardConveniosConstancias />} />
    </Routes>
  )
}

