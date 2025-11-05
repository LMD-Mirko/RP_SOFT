import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { EvaluacionesList } from './pages/EvaluacionesList'
import { Evaluacion360 } from './pages/Evaluacion360'
import { EvaluacionTecnica } from './pages/EvaluacionTecnica'

export function Evaluacion360Index() {
  return (
    <Layout>
      <Routes>
        <Route index element={<EvaluacionesList />} />
        <Route path="evaluacion-360" element={<Evaluacion360 />} />
        <Route path="evaluacion-tecnica" element={<EvaluacionTecnica />} /> 
      </Routes>
    </Layout>
  )
}
