import { useState } from 'react'
import { X } from 'lucide-react'
import { usePracticantes } from '../context/PracticantesContext'
import styles from './EvaluacionTecnicaModal.module.css'

export function EvaluacionTecnicaModal({ practicante, onClose }) {
  const [responses, setResponses] = useState({})
  const [comments, setComments] = useState('')
  const { updatePracticante } = usePracticantes()

  const preguntas = [
    "¿El código está escrito con claridad, buenas prácticas y cuenta con pruebas que validen su funcionamiento?",
    "¿El sistema cumple con todos los requerimientos definidos y produce resultados correctos sin errores críticos?",
    "¿El sistema responde en tiempos adecuados y muestra un nivel aceptable de optimización?",
    "¿La aplicación se mantiene estable bajo uso normal, sin caídas ni comportamientos inesperados?",
    "¿La documentación (comentarios, Trello, diagramas, manuales) es clara, suficiente y facilita la comprensión del sistema?"
  ]

  const handleRatingChange = (questionIndex, rating) => {
    setResponses(prev => ({
      ...prev,
      [`q${questionIndex}`]: rating
    }))
  }

  const handleSave = () => {
    // Calcular la nota promedio en escala de 0 a 20
    const totalPreguntas = preguntas.length
    const sumaRespuestas = Object.values(responses).reduce((sum, val) => sum + val, 0)
    const promedioRespuestas = sumaRespuestas / totalPreguntas // Promedio de 0-4
    const notaSobre20 = Math.round((promedioRespuestas / 4) * 20) // Convertir a escala 0-20 y redondear
    
    // Actualizar el practicante con la nota y estado
    updatePracticante(practicante.id, {
      nota: notaSobre20,
      estado: 'Evaluado',
      evaluacionTecnica: {
        responses,
        comments,
        fecha: new Date().toISOString()
      }
    })
    
    console.log('Evaluación técnica guardada:', { practicante, responses, comments, nota: notaSobre20 })
    onClose()
  }

  const isComplete = () => {
    return preguntas.every((_, index) => 
      responses[`q${index}`] !== undefined
    )
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Evaluación Técnica</h2>
            <span className={styles.icon}>⚡</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.description}>
            <p>Esta evaluación consta de 5 preguntas, las cuales deben ser respondidas en los siguientes rangos:</p>
            <div className={styles.scale}>
              <div>0 ---- No cumple</div>
              <div>1 ---- Cumple de forma mínima</div>
              <div>2 ---- Cumple parcialmente</div>
              <div>3 ---- Cumple frecuentemente</div>
              <div>4 ---- Cumple consistentemente</div>
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
              {preguntas.map((pregunta, index) => (
                <div key={index} className={styles.questionRow}>
                  <div className={styles.questionText}>{pregunta}</div>
                  <div className={styles.ratingOptions}>
                    {[0, 1, 2, 3, 4].map(rating => (
                      <label key={rating} className={styles.ratingOption}>
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value={rating}
                          checked={responses[`q${index}`] === rating}
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

          <div className={styles.commentsSection}>
            <h3>Comentarios</h3>
            <textarea
              className={styles.commentsTextarea}
              placeholder="Agrega tus comentarios aquí..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!isComplete()}
          >
            Guardar evaluación
          </button>
        </div>
      </div>
    </div>
  )
}