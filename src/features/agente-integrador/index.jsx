import { Routes, Route } from 'react-router-dom'

function DashboardAgenteIntegrador() {
  return <div className="text-lg font-semibold">Dashboard Agente Integrador</div>
}

export function AgenteIntegradorIndex() {
  return (
    <Routes>
      <Route index element={<DashboardAgenteIntegrador />} />
    </Routes>
  )
}

