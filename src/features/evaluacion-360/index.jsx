import { ModuleRouter } from './routes'
import { ToastProvider } from '@shared/components/Toast'

export function Evaluacion360Index() {
  return (
    <ToastProvider>
      <ModuleRouter />
    </ToastProvider>
  )
}
