import { Routes, Route } from 'react-router-dom'

function DashboardTranscripcionReuniones() {
  return <div className="text-lg font-semibold">Dashboard Transcripción Reuniones</div>
}

export function TranscripcionReunionesIndex() {
  return (
    <Routes>
      <Route index element={<DashboardTranscripcionReuniones />} />
    </Routes>
  )
}

