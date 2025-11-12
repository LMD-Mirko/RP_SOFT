import { useState } from 'react'
import { X } from 'lucide-react'
import { usePracticantes } from '../context/PracticantesContext'
import styles from './EvaluacionModal.module.css'

export function EvaluacionModal({ practicante, onClose }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [responses, setResponses] = useState({})
  const [comments, setComments] = useState('')
  const { updatePracticante } = usePracticantes()

  const preguntas = {
    1: [
      "¿Con qué frecuencia esta persona llega a tiempo a las reuniones o daily?",
      "Cuando falta, ¿avisa con anticipación o justifica su ausencia?",
      "¿Interacciona con el equipo por Discord o los canales de trabajo durante la semana?",
      "¿Se percibe disponible o comprometido con el progreso del grupo?",
      "¿Ayuda a compartir conocimiento cuando un compañero lo necesita?"
    ],
    2: [
      "¿Participa de forma activa y respetuosa durante las reuniones del equipo?",
      "¿Explica sus ideas y avances de manera comprensible para todos?",
      "¿Usa el micrófono para aportar, no solo para cumplir presencia?",
      "¿Se comunica si detecta retrasos o bloqueos en su trabajo?",
      "¿Se mantiene conectado y participando activamente durante las horas de trabajo remoto?"
    ]
  }

  const handleRatingChange = (questionIndex, rating) => {
    setResponses(prev => ({
      ...prev,
      [`step${currentStep}_q${questionIndex}`]: rating
    }))
  }

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSave = () => {
    // Calcular la nota promedio en escala de 0 a 20
    const totalPreguntas = Object.keys(responses).length
    const sumaRespuestas = Object.values(responses).reduce((sum, val) => sum + val, 0)
    const promedioRespuestas = sumaRespuestas / totalPreguntas // Promedio de 0-4
    const notaSobre20 = Math.round((promedioRespuestas / 4) * 20) // Convertir a escala 0-20 y redondear
    
    // Actualizar el practicante con la nota 360 y estado
    updatePracticante(practicante.id, {
      nota360: notaSobre20,
      evaluacion360: {
        responses,
        comments,
        fecha: new Date().toISOString()
      }
    })
    
    console.log('Evaluación 360 guardada:', { practicante, responses, comments, nota: notaSobre20 })
    onClose()
  }

  const isStepComplete = () => {
    const currentQuestions = preguntas[currentStep]
    return currentQuestions.every((_, index) => 
      responses[`step${currentStep}_q${index}`] !== undefined
    )
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Evaluación 360°</h2>
            <div className={styles.stepIndicator}>
              <span className={styles.stepNumber}>{currentStep}</span>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.description}>
            <p>Esta evaluación consta de 10 preguntas, las cuales deben ser respondidas en los siguientes rangos, donde:</p>
            <div className={styles.scale}>
              <div>0 ---- Nunca</div>
              <div>1 ---- Rara vez</div>
              <div>2 ---- A veces</div>
              <div>3 ---- A menudo</div>
              <div>4 ---- Siempre</div>
            </div>
          </div>

          <div className={styles.questionsSection}>
            <div className={styles.questionsHeader}>
              <span>Preguntas</span>
              <div className={styles.ratingHeaders}>
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
            </div>

            <div className={styles.questions}>
              {preguntas[currentStep].map((pregunta, index) => (
                <div key={index} className={styles.questionRow}>
                  <div className={styles.questionText}>{pregunta}</div>
                  <div className={styles.ratingOptions}>
                    {[0, 1, 2, 3, 4].map(rating => (
                      <label key={rating} className={styles.ratingOption}>
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value={rating}
                          checked={responses[`step${currentStep}_q${index}`] === rating}
                          onChange={() => handleRatingChange(index, rating)}
                        />
                        <span className={styles.radioButton}></span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentStep === 2 && (
            <div className={styles.commentsSection}>
              <h3>Comentarios</h3>
              <textarea
                className={styles.commentsTextarea}
                placeholder="Agrega tus comentarios aquí..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {currentStep === 1 ? (
            <button 
              className={styles.nextButton}
              onClick={handleNext}
              disabled={!isStepComplete()}
            >
              Siguiente Ventana
            </button>
          ) : (
            <button 
              className={styles.saveButton}
              onClick={handleSave}
              disabled={!isStepComplete()}
            >
              Guardar evaluación
            </button>
          )}
        </div>
      </div>
    </div>
  )
}