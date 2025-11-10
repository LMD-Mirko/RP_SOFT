import { Routes, Route } from 'react-router-dom'
import { TranscripcionesPage } from './pages/TranscripcionesPage.jsx'
export { TranscripcionesPage } from './pages/TranscripcionesPage.jsx'

export function TranscripcionReunionesIndex() {
  return (
    <Routes>
      <Route index element={<TranscripcionesPage />} />
    </Routes>
  )
}

