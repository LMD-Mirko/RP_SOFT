import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Plus, Mic, Send, FileText, FileSpreadsheet, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useChatPanel } from '@shared/context/ChatPanelContext'
import { ChatSidebar } from '../ChatSidebar/ChatSidebar'
import Header from '@features/agente-integrador/components/Header'
import styles from './ChatPanel.module.css'

export function ChatPanel() {
  const { isOpen, userName } = useChatPanel()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState('top')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [messageFeedback, setMessageFeedback] = useState({}) // { messageIndex: 'like' | 'dislike' }
  const [copiedIndex, setCopiedIndex] = useState(null)

  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const inputRef = useRef(null)
  const txtInputRef = useRef(null)
  const xlsxInputRef = useRef(null)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const inputContainerRef = useRef(null)

  const greetings = [
    `${userName}, ¿listo para empezar?`,
    `Hola, ${userName}`,
    `¿Qué tal, ${userName}?`,
    `Bienvenido de nuevo, ${userName}`,
    `${userName}, ¿en qué puedo ayudarte hoy?`,
    `¡Hola! ${userName}, empecemos`,
    `${userName}, ¿cómo va todo?`,
    `${userName}, te estaba esperando`,
    `¿Listo para trabajar, ${userName}?`,
    `${userName}, comencemos el día`
  ]

  const [currentGreeting] = useState(() => {
    return greetings[Math.floor(Math.random() * greetings.length)]
  })

  const placeholders = [
    'Cuantos practicantes han sido seleccionados hoy',
    'Cual fue el tema principal de la reunión de hoy',
    'Que tareas se han terminado ayer en el proyecto AV1',
    'Quienes han faltado hoy',
    'Quien tiene mas nota en el mes de diciembre',
    'A quien debo de firmar su convenio',
    'Cuantos practicantes son en total',
    'Cual fue el tema principal en el daily de hoy',
    'Que tareas se han retrasado o están con tardanza',
    'De Luis cual es su horario semanal',
    'Quien tiene la menor nota de febrero',
    'Que convenios terminan en diciembre'
  ]

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

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % 12)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

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
      // Resetear feedback para el nuevo mensaje del bot
      setMessageFeedback(prev => {
        const newFeedback = { ...prev }
        const botMessageIndex = messages.length + 1
        delete newFeedback[botMessageIndex]
        return newFeedback
      })
    }, 500)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }

    if (event.key === 'Tab' && !input.trim()) {
      event.preventDefault()
      const currentPlaceholder = placeholders[placeholderIndex]
      setInput(currentPlaceholder)
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

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.')
      return
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'es-ES'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + (prev ? ' ' : '') + transcript)
      setIsRecording(false)
    }

    recognition.onerror = (event) => {
      console.error('Error de reconocimiento de voz:', event.error)
      setIsRecording(false)

      if (event.error === 'not-allowed') {
        alert('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono.')
      } else if (event.error === 'no-speech') {
        alert('No se detectó ningún audio. Intenta hablar más cerca del micrófono.')
      } else {
        alert(`Error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev)
  }

  const handleSelectChat = (chatTitle) => {
    const simulatedResponses = {
      'Busqueda de un seleccionado...': 'Aquí están los seleccionados que encontré en el sistema.',
      'Busqueda de una reunion...': 'Encontré 3 reuniones programadas para esta semana.',
      'Registro de una tarea...': 'La tarea ha sido registrada exitosamente.',
      'Quien ingreso tarde hoy...': 'Hoy ingresaron tarde: Juan Pérez (9:15 AM) y María García (9:30 AM).',
      'Dime quien tiene una nota mayor a 18..': 'Los estudiantes con nota mayor a 18 son: Carlos López (18.5), Ana Torres (19.0).',
      'Que convenio debo de firmar hoy...': 'Tienes pendiente firmar el convenio con la empresa TechCorp.',
      'Que practicante tiene una nota no aprobo este mes...': 'El practicante Luis Rodríguez no aprobó este mes con nota 10.5.',
      'Registra a este nuevo postulante...': 'El postulante ha sido registrado correctamente en el sistema.',
      'Dime de que trato la reunion de las 9:00..': 'La reunión de las 9:00 trató sobre la planificación del proyecto Q4.',
      'Pon en tardanza a este practicante...': 'Se ha registrado la tardanza del practicante.',
      'Dime que constancia debo de firmar hoy...': 'Debes firmar 2 constancias: Constancia de trabajo y Constancia de estudios.',
      'Cuando falta Luiz Fernandez...': 'Luiz Fernández faltó los días 5, 12 y 18 de este mes.'
    }

    const response = simulatedResponses[chatTitle] || 'Esta es una conversación previa.'

    setMessages([
      { text: chatTitle.replace('...', ''), who: 'user' },
      { text: response, who: 'bot' }
    ])
    setMessageFeedback({})
  }

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const handleLike = (index) => {
    setMessageFeedback(prev => ({
      ...prev,
      [index]: prev[index] === 'like' ? null : 'like'
    }))
    // Aquí puedes agregar lógica para enviar el feedback al backend para entrenar el modelo
    console.log('Like en mensaje', index, messages[index])
  }

  const handleDislike = (index) => {
    setMessageFeedback(prev => ({
      ...prev,
      [index]: prev[index] === 'dislike' ? null : 'dislike'
    }))
    // Aquí puedes agregar lógica para enviar el feedback al backend para entrenar el modelo
    console.log('Dislike en mensaje', index, messages[index])
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
          </div>
        )}

        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
            autoFocus
          />
          {!input && (
            <div className={styles.placeholderContainer}>
              <span key={placeholderIndex} className={styles.animatedPlaceholder}>
                {placeholders[placeholderIndex]}
              </span>
            </div>
          )}
        </div>
        <button
          className={clsx(styles.micButton, isRecording && styles.micButtonRecording)}
          aria-label={isRecording ? 'Detener grabación' : 'Micrófono'}
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
      <Header />
      <div
        className={clsx(
          styles.chatMainContent,
          isSidebarCollapsed && styles.chatMainContentCollapsed,
        )}
      >
        {showGreeting ? (
          <div className={styles.greetingContainer}>
            <div className={styles.greeting}>
              <h1 className={styles.greetingText}>{currentGreeting}</h1>
            </div>
            {renderInputBar()}
          </div>
        ) : (
          <>
            <div className={styles.chatMessages}>
              {messages.map((msg, index) => {
                const isBot = msg.who === 'bot'
                const feedback = messageFeedback[index]
                const isCopied = copiedIndex === index

                return (
                  <div
                    key={`${msg.who}-${index}`}
                    className={clsx(
                      styles.message,
                      msg.who === 'user' ? styles.messageUser : styles.messageBot,
                    )}
                  >
                    <div className={styles.messageBubble}>
                      {msg.text}
                      {isBot && (
                        <div className={styles.messageActions}>
                          <button
                            className={clsx(
                              styles.actionButton,
                              isCopied && styles.actionButtonActive
                            )}
                            onClick={() => handleCopy(msg.text, index)}
                            title="Copiar mensaje"
                            aria-label="Copiar mensaje"
                          >
                            <Copy size={16} />
                            {isCopied && <span className={styles.copiedText}>Copiado</span>}
                          </button>
                          <button
                            className={clsx(
                              styles.actionButton,
                              feedback === 'like' && styles.actionButtonActive
                            )}
                            onClick={() => handleLike(index)}
                            title="Me gusta"
                            aria-label="Me gusta"
                          >
                            <ThumbsUp size={16} />
                          </button>
                          <button
                            className={clsx(
                              styles.actionButton,
                              feedback === 'dislike' && styles.actionButtonActive
                            )}
                            onClick={() => handleDislike(index)}
                            title="No me gusta"
                            aria-label="No me gusta"
                          >
                            <ThumbsDown size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
            {renderInputBar()}
          </>
        )}
      </div>
      <ChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        onSelectChat={handleSelectChat}
      />
    </div>
  )
}


