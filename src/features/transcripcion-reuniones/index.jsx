import { Routes, Route } from 'react-router-dom'
import { TranscripcionesPage } from './pages/TranscripcionesPage.jsx'
import { ScrumScrumPage } from './pages/ScrumScrumPage.jsx'
import { DailyScrumPage } from './pages/DailyScrumPage.jsx'
import { Layout } from './components/Layout.jsx'
import { PanelCentralPage } from './pages/PanelCentralPage.jsx'
export { TranscripcionesPage } from './pages/TranscripcionesPage.jsx'

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}><h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2></div>
}

export function TranscripcionReunionesIndex() {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route index element={<TranscripcionesPage />} />
        <Route path="daily-scrum" element={<DailyScrumPage />} />
        <Route path="scrum-scrum" element={<ScrumScrumPage />} />
        <Route path="panel-central" element={<PanelCentralPage />} />
        <Route path="transcripciones" element={<TranscripcionesPage />} />
      </Route>
    </Routes>
  )
}

