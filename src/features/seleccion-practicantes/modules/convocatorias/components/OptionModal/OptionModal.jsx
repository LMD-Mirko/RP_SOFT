import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { CheckCircle2 } from 'lucide-react'
import styles from './OptionModal.module.css'

export function OptionModal({
  isOpen,
  onClose,
  onAdd,
  onFinish,
  question,
  option = null,
  optionsCount = 0,
  isLoading = false,
}) {
  const [text, setText] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')

  // Calcular el siguiente orden disponible basándose en las opciones existentes
  const calculateNextOrder = () => {
    // Buscar opciones en answer_options o options
    const existingOptions = question?.answer_options || question?.options || []
    
    if (!existingOptions || existingOptions.length === 0) {
      return 1
    }
    
    // Obtener el máximo orden de las opciones existentes
    const maxOrder = Math.max(...existingOptions.map(opt => opt.order || 0), 0)
    return maxOrder + 1
  }

  useEffect(() => {
    if (option) {
      setText(option.text || '')
      setIsCorrect(option.is_correct || false)
      setOrder(option.order || 1)
    } else {
      setText('')
      setIsCorrect(false)
      // Calcular automáticamente el siguiente orden disponible
      const nextOrder = calculateNextOrder()
      setOrder(nextOrder)
    }
    setError('')
  }, [option, question, isOpen])

  const handleAdd = (e) => {
    e.preventDefault()
    setError('')

    if (!text.trim()) {
      setError('El texto de la opción es requerido')
      return
    }

    if (order < 1) {
      setError('El orden debe ser mayor a 0')
      return
    }

    onAdd({
      text: text.trim(),
      is_correct: isCorrect,
      order: parseInt(order, 10),
      is_active: true,
    })

    // Limpiar formulario para agregar otra
    setText('')
    setIsCorrect(false)
    // Incrementar el orden automáticamente para la siguiente opción
    setOrder(prevOrder => prevOrder + 1)
  }

  const handleFinish = () => {
    // Si hay datos sin guardar, preguntar
    if (text.trim()) {
      if (window.confirm('¿Deseas guardar esta opción antes de finalizar?')) {
        handleAdd({ preventDefault: () => {} })
        setTimeout(() => {
          onFinish()
        }, 300)
      } else {
        onFinish()
      }
    } else {
      onFinish()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={option ? 'Editar Opción' : 'Agregar Opción'}
      size="md"
      closeOnOverlayClick={!isLoading}
    >
      <Modal.Body>
        <div className={styles.content}>
        {question && (
          <div className={styles.questionInfo}>
            <span className={styles.questionLabel}>Pregunta:</span>
            <p className={styles.questionText}>{question.text}</p>
          </div>
        )}

        {!option && optionsCount > 0 && (
          <div className={styles.counter}>
            Opciones agregadas: {optionsCount}
          </div>
        )}

        <form onSubmit={handleAdd} className={styles.form}>
          <Input
            label="Texto de la opción"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            placeholder="Escribe la opción aquí..."
            error={error && !text.trim()}
            helperText={error && !text.trim() ? error : ''}
            disabled={isLoading}
          />

          <div className={styles.checkboxContainer}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isCorrect}
                onChange={(e) => setIsCorrect(e.target.checked)}
                className={styles.checkbox}
                disabled={isLoading}
              />
              <span className={styles.checkboxText}>
                <CheckCircle2 size={18} />
                ¿Es la respuesta correcta?
              </span>
            </label>
          </div>

          <Input
            label="Orden"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            required
            min={1}
            error={error && order < 1}
            helperText={error && order < 1 ? error : 'El orden determina la posición de la opción'}
            disabled={isLoading}
          />

          {error && error !== 'El texto de la opción es requerido' && error !== 'El orden debe ser mayor a 0' && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          <div className={styles.actions}>
            {!option && (
              <>
                <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="button" variant="secondary" onClick={handleFinish} disabled={isLoading}>
                  Finalizar
                </Button>
                <Button type="submit" variant="primary" loading={isLoading}>
                  Agregar otra
                </Button>
              </>
            )}
            {option && (
              <>
                <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" loading={isLoading}>
                  Guardar Cambios
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
      </Modal.Body>
    </Modal>
  )
}

