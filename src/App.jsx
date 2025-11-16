import { Router } from '@app/routes'
import { GeminiProvider } from './features/agente-integrador/context/GeminiContext';
import { ChatPanelProvider } from '@shared/context/ChatPanelContext';

function App() {
  return (
    <GeminiProvider>
      <ChatPanelProvider>
        <Router />
      </ChatPanelProvider>
    </GeminiProvider>
  );
}

export default App;
