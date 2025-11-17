import { Router } from '@app/routes'
import { ToastProvider } from '@shared/components/Toast'
import { GeminiProvider } from './features/agente-integrador/context/GeminiContext'
import { ChatPanelProvider } from '@shared/context/ChatPanelContext'
import { ConfigProvider } from 'antd'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Be Vietnam Pro', sans-serif",
          borderRadius: 8,
        },
      }}
    >
      <ToastProvider>
        <GeminiProvider>
          <ChatPanelProvider>
            <Router />
          </ChatPanelProvider>
        </GeminiProvider>
      </ToastProvider>
    </ConfigProvider>
  )
}
