import { Routes, Route } from 'react-router-dom'

function DashboardDatasetTranscripcion() {
  return <div className="text-lg font-semibold">Dashboard Dataset Transcripción</div>
}

export function DatasetTranscripcionIndex() {
  return (
    <Routes>
      <Route index element={<DashboardDatasetTranscripcion />} />
    </Routes>
  )
}

