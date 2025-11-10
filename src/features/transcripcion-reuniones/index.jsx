import { Routes, Route } from 'react-router-dom'
import { TranscripcionesPage } from './pages/TranscripcionesPage.jsx'
import { Layout } from './components/Layout.jsx'
export { TranscripcionesPage } from './pages/TranscripcionesPage.jsx'

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}><h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2></div>
}

export function TranscripcionReunionesIndex() {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route index element={<TranscripcionesPage />} />
        <Route path="daily-scrum" element={<Placeholder title="Daily Scrum" />} />
        <Route path="scrum-scrum" element={<Placeholder title="Scrum de Scrum" />} />
        <Route path="panel-central" element={<Placeholder title="Panel Central" />} />
        <Route path="transcripciones" element={<TranscripcionesPage />} />
      </Route>
    </Routes>
  )
}

