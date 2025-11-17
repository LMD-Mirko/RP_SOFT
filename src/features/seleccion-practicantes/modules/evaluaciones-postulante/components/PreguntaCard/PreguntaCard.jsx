import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, FileText } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import styles from './PreguntaCard.module.css'

/**
 * Componente para mostrar y responder una pregunta de evaluación
 */
export function PreguntaCard({
  pregunta,
  respuestaActual,
  onAnswerChange,
  showResults = false,
  disabled = false,
}) {
  const [selectedOption, setSelectedOption] = useState(
    respuestaActual?.answer_option_id || null
  )
  const [textAnswer, setTextAnswer] = useState(
    respuestaActual?.text_answer || ''
  )

  useEffect(() => {
    setSelectedOption(respuestaActual?.answer_option_id || null)
    setTextAnswer(respuestaActual?.text_answer || '')
  }, [respuestaActual])

  const handleOptionSelect = (optionId) => {
    if (disabled) return
    setSelectedOption(optionId)
    if (onAnswerChange) {
      onAnswerChange(pregunta.id, optionId, null)
    }
  }

  const handleTextAnswerChange = (value) => {
    if (disabled) return
    setTextAnswer(value)
    if (onAnswerChange) {
      onAnswerChange(pregunta.id, null, value)
    }
  }

  const getOptionStatus = (option) => {
    if (!showResults) return null
    
    const isSelected = selectedOption === option.id
    const isCorrect = option.is_correct
    
    if (isSelected && isCorrect) return 'correct'
    if (isSelected && !isCorrect) return 'incorrect'
    if (!isSelected && isCorrect) return 'should-be-selected'
    return null
  }

  return (
    <div className={styles.preguntaCard}>
      <div className={styles.preguntaHeader}>
        <div className={styles.preguntaInfo}>
          <span className={styles.preguntaNumber}>
            Pregunta {pregunta.order || 0}
          </span>
          {pregunta.points && (
            <span className={styles.preguntaPoints}>
              {pregunta.points} {pregunta.points === 1 ? 'punto' : 'puntos'}
            </span>
          )}
        </div>
        {showResults && respuestaActual?.is_correct !== undefined && (
          <div
            className={`${styles.resultBadge} ${
              respuestaActual.is_correct ? styles.correct : styles.incorrect
            }`}
          >
            {respuestaActual.is_correct ? (
              <>
                <CheckCircle2 size={16} />
                Correcta
              </>
            ) : (
              <>
                <Circle size={16} />
                Incorrecta
              </>
            )}
          </div>
        )}
      </div>

      <p className={styles.preguntaText}>{pregunta.text}</p>

      {/* Opción Múltiple o Verdadero/Falso */}
      {(pregunta.question_type === 'multiple_choice' ||
        pregunta.question_type === 'true_false') &&
        pregunta.answer_options &&
        pregunta.answer_options.length > 0 && (
          <div className={styles.opcionesList}>
            {pregunta.answer_options.map((opcion) => {
              const status = getOptionStatus(opcion)
              const isSelected = selectedOption === opcion.id

              return (
                <div
                  key={opcion.id}
                  className={`${styles.opcionItem} ${
                    isSelected ? styles.opcionSelected : ''
                  } ${status ? styles[`opcion${status.charAt(0).toUpperCase() + status.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}`] : ''}`}
                  onClick={() => handleOptionSelect(opcion.id)}
                >
                  <div className={styles.opcionContent}>
                    <div className={styles.opcionRadio}>
                      {isSelected ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </div>
                    <span className={styles.opcionText}>{opcion.text}</span>
                  </div>
                  {showResults && status && (
                    <div className={styles.opcionStatus}>
                      {status === 'correct' && (
                        <span className={styles.statusCorrect}>✓ Correcta</span>
                      )}
                      {status === 'incorrect' && (
                        <span className={styles.statusIncorrect}>
                          ✗ Incorrecta
                        </span>
                      )}
                      {status === 'should-be-selected' && (
                        <span className={styles.statusShouldBe}>
                          ⚠ Respuesta correcta
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      {/* Respuesta Corta */}
      {pregunta.question_type === 'short_answer' && (
        <div className={styles.textAnswerContainer}>
          <Textarea
            value={textAnswer}
            onChange={(e) => handleTextAnswerChange(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            rows={4}
            disabled={disabled}
            className={styles.textAnswer}
          />
          {showResults && respuestaActual?.points_earned !== undefined && (
            <div className={styles.pointsEarned}>
              Puntos obtenidos: {respuestaActual.points_earned || 0} /{' '}
              {pregunta.points || 1}
            </div>
          )}
        </div>
      )}

      {showResults && respuestaActual?.points_earned !== undefined && (
        <div className={styles.pointsInfo}>
          <FileText size={16} />
          <span>
            Puntos: {respuestaActual.points_earned || 0} / {pregunta.points || 1}
          </span>
        </div>
      )}
    </div>
  )
}

