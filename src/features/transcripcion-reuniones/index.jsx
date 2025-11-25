import { Routes, Route } from 'react-router-dom'
import { TranscripcionesPage } from './modules/grabaciones/pages/GrabacionesPage.jsx'
import { ScrumScrumPage } from './modules/scrum-scrum/pages/ScrumScrumPage.jsx'
import { DailyScrumPage } from './modules/daily-scrum/pages/DailyScrumPage.jsx'
import { Layout } from './components/layout/Layout.jsx'
import { PanelCentralPage } from './modules/panel-central/pages/PanelCentralPage.jsx'
import Error404 from '@shared/interfaces/Error404'
export { TranscripcionesPage } from './modules/grabaciones/pages/GrabacionesPage.jsx'

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
      
      {/* Ruta 404 para rutas no encontradas (sin Layout) */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  )
}

