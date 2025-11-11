import { Router } from '@app/routes'
import { ToastProvider } from '@shared/components/Toast'
import { GeminiProvider } from './features/agente-integrador/context/GeminiContext'
import { ChatPanelProvider } from '@shared/context/ChatPanelContext'

export default function App() {
  return (
    <ToastProvider>
      <GeminiProvider>
        <ChatPanelProvider>
          <Router />
        </ChatPanelProvider>
      </GeminiProvider>
    </ToastProvider>
  )
}
