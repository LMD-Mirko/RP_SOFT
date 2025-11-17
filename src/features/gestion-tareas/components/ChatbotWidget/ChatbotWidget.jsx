import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './ChatbotWidget.module.css'

function generateReply(text, context) {
  const t = text.toLowerCase()

  if (/(hola|buenas|hey)/.test(t)) {
    if (context === 'backlog') return '¡Hola! Veo que estás en el Backlog. ¿Quieres ayuda para priorizar o refinar historias?'
    if (context === 'sprint') return '¡Hola! Estás en el Sprint Board. ¿Te ayudo a organizar las tareas del sprint?'
    if (context === 'metricas') return '¡Hola! Aquí puedes ver métricas del equipo. ¿Te explico alguna en detalle?'
    if (context === 'historias') return '¡Hola! Estás en el repositorio de historias. ¿Quieres que armemos una user story juntos?'
    return '¡Hola! ¿En qué puedo ayudarte con tus tareas o sprints?'
  }

  if (/(backlog|producto)/.test(t) || context === 'backlog') {
    return 'El backlog se prioriza por valor y urgencia. Podemos: 1) listar historias clave, 2) estimarlas y 3) ordenarlas por impacto.'
  }

  if (/(sprint|tablero|board|kanban)/.test(t) || context === 'sprint') {
    return 'En el Sprint Board lo ideal es que cada tarea tenga responsable, estado claro y no exceder el WIP por columna. ¿Qué columna te preocupa?'
  }

  if (/(historia|user story)/.test(t) || context === 'historias') {
    return 'Una buena historia sigue: "Como [rol], quiero [acción], para [beneficio]". Si me dices el rol y la acción, te propongo una historia completa.'
  }

  if (/(métrica|velocidad|burndown|burn down|burn-down)/.test(t) || context === 'metricas') {
    return 'Las métricas más usadas son: Velocidad del equipo por sprint, Burndown chart y Lead time. Podemos revisar cómo interpretarlas para tus datos.'
  }

  if (/(asignar|responsable|owner)/.test(t)) {
    return 'Para asignar una tarea, abre el detalle y selecciona al responsable. Procura que cada tarea del sprint tenga al menos un owner claro.'
  }

  const fallbacks = [
    'Entiendo. ¿Podrías darme un poco más de contexto o un ejemplo concreto?','Puedo ayudarte a desglosar tareas, priorizar el backlog o planificar el próximo sprint.','¿Quieres que te sugiera subtareas y estimaciones para una historia específica?','Puedo simular una respuesta típica del equipo. Cuéntame el caso que quieres probar.'
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

export function ChatbotWidget() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 'm1', role: 'bot', text: 'Soy tu asistente para Gestión de Tareas. ¿Qué necesitas hoy?' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const listRef = useRef(null)

  const ctx = (() => {
    if (location.pathname.includes('backlog')) return 'backlog'
    if (location.pathname.includes('sprint-board')) return 'sprint'
    if (location.pathname.includes('historias')) return 'historias'
    if (location.pathname.includes('metricas')) return 'metricas'
    return 'general'
  })()

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('gestionTareas.chatbot')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setMessages(parsed.messages)
        }
        if (typeof parsed.open === 'boolean') {
          setOpen(parsed.open)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'gestionTareas.chatbot',
        JSON.stringify({ messages, open })
      )
    } catch (e) {
      // ignore
    }
  }, [messages, open])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const reply = { id: crypto.randomUUID(), role: 'bot', text: generateReply(text, ctx) }
      setMessages((prev) => [...prev, reply])
      setIsTyping(false)
    }, 600)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className={styles.container}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.title}>Asistente de Tareas</div>
            <button className={styles.iconBtn} onClick={() => setOpen(false)} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
          <div ref={listRef} className={styles.messages}>
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? styles.msgUser : styles.msgBot}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className={styles.typingRow}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            )}
          </div>
          <div className={styles.inputBar}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribe tu mensaje..."
              className={styles.textarea}
              rows={1}
            />
            <button className={styles.sendBtn} onClick={send} aria-label="Enviar">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button className={styles.fab} onClick={() => setOpen((v) => !v)} aria-label="Abrir chat">
        <MessageCircle size={22} />
        <span className={styles.fabLabel}>Chat</span>
      </button>
    </div>
  )
}

export default ChatbotWidget
