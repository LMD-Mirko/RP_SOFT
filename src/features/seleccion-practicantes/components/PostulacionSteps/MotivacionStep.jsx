import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { MessageSquare, Target, CheckCircle } from 'lucide-react'
import styles from './StepForm.module.css'

export function MotivacionStep({ data, onNext, onBack }) {
  const [formData, setFormData] = useState({
    motivacion: data.motivacion || '',
    expectativas: data.expectativas || '',
    participacionProyectos: data.participacionProyectos || '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.motivacion.trim()) newErrors.motivacion = 'Este campo es requerido'
    if (!formData.expectativas.trim()) newErrors.expectativas = 'Este campo es requerido'
    if (!formData.participacionProyectos.trim()) newErrors.participacionProyectos = 'Este campo es requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onNext(formData)
    }
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepCard}>
        <div className={styles.stepHeader}>
          <h2 className={styles.stepTitle}>Encuesta de Motivación</h2>
          <p className={styles.stepSubtitle}>Cuéntanos sobre tu motivación para unirte a RPsoft</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Motivación */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <MessageSquare size={20} />
              ¿Por qué quieres hacer prácticas en RPsoft?
            </label>
            <textarea
              name="motivacion"
              value={formData.motivacion}
              onChange={handleChange}
              placeholder="Cuéntanos tu motivación"
              className={`${styles.textarea} ${errors.motivacion ? styles.textareaError : ''}`}
              rows={4}
            />
            {errors.motivacion && (
              <span className={styles.errorText}>{errors.motivacion}</span>
            )}
          </div>

          {/* Expectativas */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <Target size={20} />
              ¿Qué esperas aprender durante tus prácticas?
            </label>
            <textarea
              name="expectativas"
              value={formData.expectativas}
              onChange={handleChange}
              placeholder="Describe tus expectativas..."
              className={`${styles.textarea} ${errors.expectativas ? styles.textareaError : ''}`}
              rows={4}
            />
            {errors.expectativas && (
              <span className={styles.errorText}>{errors.expectativas}</span>
            )}
          </div>

          {/* Participación en proyectos */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <CheckCircle size={20} />
              ¿Estarías dispuesto a participar en proyectos reales?
            </label>
            <textarea
              name="participacionProyectos"
              value={formData.participacionProyectos}
              onChange={handleChange}
              placeholder="Sí, estoy dispuesto porque..."
              className={`${styles.textarea} ${errors.participacionProyectos ? styles.textareaError : ''}`}
              rows={4}
            />
            {errors.participacionProyectos && (
              <span className={styles.errorText}>{errors.participacionProyectos}</span>
            )}
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className={styles.buttonSecondary}
            >
              Atrás
            </Button>
            <Button
              type="submit"
              variant="primary"
              className={styles.buttonPrimary}
            >
              Siguiente
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}