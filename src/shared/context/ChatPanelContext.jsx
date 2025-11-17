import React, { createContext, useContext, useState } from 'react'

const ChatPanelContext = createContext()

export function ChatPanelProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [userName] = useState('Carlos') // Puedes obtener esto de un contexto de usuario

  const openChat = () => setIsOpen(true)
  const closeChat = () => setIsOpen(false)
  const toggleChat = () => setIsOpen(prev => !prev)

  return (
    <ChatPanelContext.Provider value={{ isOpen, userName, openChat, closeChat, toggleChat }}>
      {children}
    </ChatPanelContext.Provider>
  )
}

export function useChatPanel() {
  const context = useContext(ChatPanelContext)
  if (!context) {
    throw new Error('useChatPanel must be used within ChatPanelProvider')
  }
  return context
}

