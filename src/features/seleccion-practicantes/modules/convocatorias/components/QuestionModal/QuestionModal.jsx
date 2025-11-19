import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import styles from './QuestionModal.module.css'

export function QuestionModal({ isOpen, onClose, onSave, question = null, existingQuestions = [], isLoading = false }) {
  const [text, setText] = useState('')
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')

  // Calcular el siguiente orden disponible basándose en las preguntas existentes
  const calculateNextOrder = () => {
    if (!existingQuestions || existingQuestions.length === 0) {
      return 1
    }
    
    // Obtener el máximo orden de las preguntas existentes
    const maxOrder = Math.max(...existingQuestions.map(q => q.order || 0), 0)
    return maxOrder + 1
  }

  useEffect(() => {
    if (question) {
      setText(question.text || '')
      setOrder(question.order || 1)
    } else {
      setText('')
      // Calcular automáticamente el siguiente orden disponible
      const nextOrder = calculateNextOrder()
      setOrder(nextOrder)
    }
    setError('')
  }, [question, existingQuestions, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!text.trim()) {
      setError('El texto de la pregunta es requerido')
      return
    }

    if (order < 1) {
      setError('El orden debe ser mayor a 0')
      return
    }

    onSave({
      text: text.trim(),
      order: parseInt(order, 10),
      is_active: true,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={question ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}
      size="md"
      closeOnOverlayClick={!isLoading}
    >
      <Modal.Body>
        <form onSubmit={handleSubmit} className={styles.form}>
        <Textarea
          label="Texto de la pregunta"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          placeholder="Escribe la pregunta aquí..."
          error={error && !text.trim()}
          helperText={error && !text.trim() ? error : ''}
          disabled={isLoading}
        />

        <Input
          label="Orden"
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          required
          min={1}
          error={error && order < 1}
          helperText={error && order < 1 ? error : 'El orden determina la posición de la pregunta'}
          disabled={isLoading}
        />

        {error && error !== 'El texto de la pregunta es requerido' && error !== 'El orden debe ser mayor a 0' && (
          <div className={styles.errorMessage}>{error}</div>
        )}

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            {question ? 'Guardar Cambios' : 'Crear Pregunta'}
          </Button>
        </div>
      </form>
      </Modal.Body>
    </Modal>
  )
}

