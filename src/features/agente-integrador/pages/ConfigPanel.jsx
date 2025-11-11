import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Plus, Mic, Send, FileText, FileSpreadsheet, QrCode } from 'lucide-react'
import { useChatPanel } from '@shared/context/ChatPanelContext'
import { ChatSidebar } from './ChatSidebar'
import styles from './ChatPanel.module.css'

export function ChatPanel() {
  const { isOpen, userName } = useChatPanel()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState('top')

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const txtInputRef = useRef(null)
  const xlsxInputRef = useRef(null)
  const qrInputRef = useRef(null)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const inputContainerRef = useRef(null)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      setShowMenu(false)
    }
  }, [messages.length])

  useEffect(() => {
    if (showMenu && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom

      if (spaceBelow < 150) {
        setMenuPosition('top')
      } else {
        setMenuPosition('bottom')
      }
    }
  }, [showMenu])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setMessages(prev => [...prev, { text: trimmed, who: 'user' }])
    setInput('')
    setShowMenu(false)
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

  const handleTxtUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = ({ target }) => {
      if (typeof target?.result !== 'string') return

      setMessages(prev => [
        ...prev,
        { text: `Archivo TXT: ${file.name}\n${target.result}`, who: 'user' },
      ])
    }
    reader.readAsText(file)

    if (txtInputRef.current) {
      txtInputRef.current.value = ''
    }
    setShowMenu(false)
  }

  const handleXlsxUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setMessages(prev => [
      ...prev,
      { text: `Archivo Excel: ${file.name} (procesando...)`, who: 'user' },
    ])

    if (xlsxInputRef.current) {
      xlsxInputRef.current.value = ''
    }
    setShowMenu(false)
  }

  const handleQrUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = ({ target }) => {
      setMessages(prev => [
        ...prev,
        { text: `Código QR: ${file.name} (procesando...)`, who: 'user' },
      ])
    }
    reader.readAsDataURL(file)

    if (qrInputRef.current) {
      qrInputRef.current.value = ''
    }
    setShowMenu(false)
  }

  const handleMicClick = () => {
    alert('Funcionalidad de micrófono próximamente')
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev)
  }

  const renderInputBar = () => (
    <div className={styles.chatInput}>
      <div ref={inputContainerRef} className={styles.inputContainer}>
        <input
          ref={txtInputRef}
          type="file"
          accept=".txt"
          style={{ display: 'none' }}
          onChange={handleTxtUpload}
        />
        <input
          ref={xlsxInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={handleXlsxUpload}
        />
        <input
          ref={qrInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleQrUpload}
        />

        <button
          ref={buttonRef}
          className={styles.fileButton}
          aria-label="Opciones de archivo"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowMenu(prev => !prev)
          }}
          type="button"
        >
          <Plus size={20} />
        </button>

        {showMenu && (
          <div 
            ref={menuRef} 
            className={clsx(
              styles.fileMenu,
              menuPosition === 'bottom' && styles.fileMenuBottom
            )}
          >
            <div
              onClick={() => txtInputRef.current?.click()}
              className={styles.menuOption}
            >
              <FileText size={20} className={styles.menuIcon} />
              <span>Subir archivo TXT</span>
            </div>

            <div
              onClick={() => xlsxInputRef.current?.click()}
              className={styles.menuOption}
            >
              <FileSpreadsheet size={20} className={styles.menuIcon} />
              <span>Subir archivo XLSX</span>
            </div>

            <div
              onClick={() => qrInputRef.current?.click()}
              className={styles.menuOption}
            >
              <QrCode size={20} className={styles.menuIcon} />
              <span>Subir código QR</span>
            </div>
          </div>
        )}

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



