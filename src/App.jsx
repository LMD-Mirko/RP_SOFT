import { Router } from '@app/routes'
import { ToastProvider } from '@shared/components/Toast'

export default function App() {
  return (
    <ToastProvider>
      <Router />
    </ToastProvider>
  )
}
