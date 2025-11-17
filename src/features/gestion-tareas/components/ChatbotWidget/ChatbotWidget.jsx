import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import styles from './ChatbotWidget.module.css'

function generateReply(text) {
  const t = text.toLowerCase()
  if (/(hola|buenas|hey)/.test(t)) return '¡Hola! ¿En qué puedo ayudarte con tus tareas o sprints?'
  if (/(backlog|producto)/.test(t)) return 'El backlog se prioriza por valor y urgencia. ¿Quieres crear, refinar o estimar historias?'
  if (/(sprint|tablero|board|kanban)/.test(t)) return 'En el Sprint Board puedes mover tareas entre columnas y ver su estado. ¿Buscas algo en particular?'
  if (/(historia|user story)/.test(t)) return 'Una historia útil sigue el formato: Como [rol], quiero [acción], para [beneficio].'
  if (/(métrica|velocidad|burndown)/.test(t)) return 'Las métricas clave: Velocidad del equipo, Burndown chart y Lead time. Puedo explicarte alguna.'
  if (/(asignar|responsable|owner)/.test(t)) return 'Para asignar, abre la tarea y selecciona el responsable. ¿Sobre qué tarea hablamos?'
  const fallbacks = [
    'Entiendo. ¿Podrías darme más contexto o un ejemplo?','Puedo ayudarte a desglosar tareas, priorizar backlog o planificar el sprint.','¿Quieres que te sugiera subtareas y estimaciones?','Puedo simular una respuesta típica del equipo. ¿Qué caso quieres probar?'
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 'm1', role: 'bot', text: 'Soy tu asistente para Gestión de Tareas. ¿Qué necesitas hoy?' }
  ])
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      const reply = { id: crypto.randomUUID(), role: 'bot', text: generateReply(text) }
      setMessages((prev) => [...prev, reply])
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
