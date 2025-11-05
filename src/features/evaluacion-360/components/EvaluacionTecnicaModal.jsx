import { useState } from 'react'
import { X } from 'lucide-react'
import styles from './EvaluacionTecnicaModal.module.css'

export function EvaluacionTecnicaModal({ practicante, onClose }) {
  const [responses, setResponses] = useState({})
  const [comments, setComments] = useState('')

  const preguntas = [
    "¿El código está escrito con claridad, buenas prácticas y cuenta con pruebas que validen su funcionamiento?",
    "¿El sistema o módulo tiene una arquitectura definida y produce resultados conectados sin errores críticos?",
    "¿El sistema responde en tiempos adecuados y muestra un nivel razonable de optimización?",
    "¿La aplicación se mantiene estable bajo uso normal, sin caídas o comportamientos inesperados?",
    "¿La documentación (comentarios, Trello, diagramas, manuales) facilita la comprensión del sistema?"
  ]

  const escala = [
    { value: 0, label: "Cumple de forma mínima" },
    { value: 1, label: "Cumple parcialmente" },
    { value: 2, label: "Cumple satisfactoriamente" },
    { value: 3, label: "Cumple completamente" },
    { value: 4, label: "Cumple completamente" }
  ]

  const handleRatingChange = (questionIndex, rating) => {
    setResponses(prev => ({
      ...prev,
      [`q${questionIndex}`]: rating
    }))
  }

  const handleSave = () => {
    console.log('Evaluación técnica guardada:', { practicante, responses, comments })
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
            <p>Esta evaluación consta de 5 preguntas. Las cuales deben ser respondidas en los siguientes rangos:</p>
            <div className={styles.scale}>
              <div>0 ---- Cumple de forma mínima</div>
              <div>1 ---- Cumple parcialmente</div>
              <div>2 ---- Cumple satisfactoriamente</div>
              <div>3 ---- Cumple solventemente</div>
              <div>4 ---- Cumple completamente</div>
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