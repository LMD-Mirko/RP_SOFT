import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Plus, Mic, Send } from 'lucide-react'
import { useChatPanel } from '@shared/context/ChatPanelContext'
import { ChatSidebar } from './ChatSidebar'
import styles from './ChatPanel.module.css'

export function ChatPanel() {
  const { isOpen, userName } = useChatPanel()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const focusTimeout = window.setTimeout(() => {
        inputRef.current?.focus()
      }, 100)

      return () => window.clearTimeout(focusTimeout)
    }

    return undefined
  }, [isOpen, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setMessages(prev => [...prev, { text: trimmed, who: 'user' }])
    setInput('')
    inputRef.current?.focus()

    window.setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: 'Gracias por tu mensaje. ¿En qué más puedo ayudarte?', who: 'bot' },
      ])
    }, 500)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.txt')) {
      alert('Por favor, selecciona un archivo .txt')
      return
    }

    const reader = new FileReader()
    reader.onload = ({ target }) => {
      if (typeof target?.result !== 'string') return

      setMessages(prev => [
        ...prev,
        { text: `📎 Archivo: ${file.name}\n${target.result}`, who: 'user' },
      ])
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleMicClick = () => {
    alert('Funcionalidad de micrófono próximamente')
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev)
  }

  const renderInputBar = () => (
    <div className={styles.chatInput}>
      <div className={styles.inputContainer}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          className={styles.fileInput}
          onChange={handleFileSelect}
        />
        <button
          className={styles.fileButton}
          aria-label="Adjuntar archivo txt"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus size={20} />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Pregunta lo que quieras"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
          autoFocus
        />
        <button
          className={styles.micButton}
          aria-label="Micrófono"
          onClick={handleMicClick}
        >
          <Mic size={20} />
        </button>
        <button
          onClick={handleSend}
          className={styles.sendButton}
          disabled={!input.trim()}
          aria-label="Enviar mensaje"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )

  if (!isOpen) {
    return null
  }

  const showGreeting = messages.length === 0

  return (
    <div
      className={clsx(styles.chatPanel, isSidebarCollapsed && styles.chatPanelCollapsed)}
    >
      <div
        className={clsx(
          styles.chatMainContent,
          isSidebarCollapsed && styles.chatMainContentCollapsed,
        )}
      >
        {showGreeting ? (
          <div className={styles.greetingContainer}>
            <div className={styles.greeting}>
              <h1 className={styles.greetingText}>Hola, {userName}</h1>
            </div>
            {renderInputBar()}
          </div>
        ) : (
          <>
            <div className={styles.chatMessages}>
              {messages.map((msg, index) => (
                <div
                  key={`${msg.who}-${index}`}
                  className={clsx(
                    styles.message,
                    msg.who === 'user' ? styles.messageUser : styles.messageBot,
                  )}
                >
                  <div className={styles.messageBubble}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {renderInputBar()}
          </>
        )}
      </div>
      <ChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
    </div>
  )
}

