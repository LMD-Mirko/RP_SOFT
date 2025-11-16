import { useEffect, useState } from 'react'
import { enviarFeedback, getEvaluaciones } from '../services/feedback.service'

export function useUserFeedback() {
  const [loading, setLoading] = useState(true)
  const [evaluaciones, setEvaluaciones] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [sending, setSending] = useState(false)

  const load = async () => {
    setLoading(true)
    const data = await getEvaluaciones()
    setEvaluaciones(data)
    setLoading(false)
  }

  const send = async () => {
    if (!mensaje.trim()) return
    setSending(true)
    await enviarFeedback(mensaje.trim())
    setMensaje('')
    setSending(false)
  }

  useEffect(() => {
    load()
  }, [])

  return { loading, evaluaciones, mensaje, setMensaje, sending, send }
}
