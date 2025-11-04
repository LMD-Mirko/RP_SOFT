import { ModuleRouter } from './routes'
import { ToastProvider } from '@shared/components/Toast'

export function SeleccionPracticantesIndex() {
  return (
    <ToastProvider>
      <ModuleRouter />
    </ToastProvider>
  )
}
