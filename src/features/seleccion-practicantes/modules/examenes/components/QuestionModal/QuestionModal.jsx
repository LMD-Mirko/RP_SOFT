import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import styles from './QuestionModal.module.css'

export function QuestionModal({ isOpen, onClose, onSave, question = null, existingQuestions = [], isLoading = false }) {
  const [text, setText] = useState('')
  const [order, setOrder] = useState(1)
  const [points, setPoints] = useState(1.0)
  const [questionType, setQuestionType] = useState('multiple_choice')
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
      setPoints(question.points || 1.0)
      setQuestionType(question.question_type || 'multiple_choice')
    } else {
      setText('')
      // Calcular automáticamente el siguiente orden disponible
      const nextOrder = calculateNextOrder()
      setOrder(nextOrder)
      setPoints(1.0)
      setQuestionType('multiple_choice')
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

    if (points < 0) {
      setError('Los puntos deben ser mayor o igual a 0')
      return
    }

    onSave({
      text: text.trim(),
      order: parseInt(order, 10),
      points: parseFloat(points),
      question_type: questionType,
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
          <Input
            label="Puntos"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            required
            min={0}
            step="0.5"
            error={error && points < 0}
            helperText={error && points < 0 ? error : 'Puntos que vale esta pregunta'}
            disabled={isLoading}
          />
        </div>

        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          disabled={isLoading}
          style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            fontSize: '0.875rem',
            fontFamily: "'Be Vietnam Pro', sans-serif"
          }}
        >
          <option value="multiple_choice">Opción Múltiple</option>
          <option value="true_false">Verdadero/Falso</option>
          <option value="short_answer">Respuesta Corta</option>
        </select>

        {error && error !== 'El texto de la pregunta es requerido' && error !== 'El orden debe ser mayor a 0' && error !== 'Los puntos deben ser mayor o igual a 0' && (
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

