import { ModuleRouter } from './routes'
import { PracticantesProvider } from './context/PracticantesContext'

export function Evaluacion360Index() {
  return (
    <PracticantesProvider>
      <ModuleRouter />
    </PracticantesProvider>
  )
}
