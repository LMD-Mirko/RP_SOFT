import { Routes, Route } from 'react-router-dom'

function DashboardEvaluacion360() {
  return <div className="text-lg font-semibold">Dashboard Evaluación 360</div>
}

export function Evaluacion360Index() {
  return (
    <Routes>
      <Route index element={<DashboardEvaluacion360 />} />
    </Routes>
  )
}

