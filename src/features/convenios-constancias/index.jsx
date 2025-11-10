import { ModuleRouter } from './routes'
import { ToastProvider } from '@shared/components/Toast'

export function ConveniosConstanciasIndex() {
  return (
    <ToastProvider>
      <ModuleRouter />
    </ToastProvider>
  )
}

