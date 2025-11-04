import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Briefcase, BookOpen, Clock } from 'lucide-react'
import styles from './StepForm.module.css'

const OPCIONES_AREA = [
  { value: 'frontend', label: 'Desarrollo Frontend (HTML, CSS, JavaScript, React)', icon: '💻' },
  { value: 'backend', label: 'Desarrollo Backend(Python, Django, Bases de datos)', icon: '⚙️' },
  { value: 'ux', label: 'Diseño UX/UI (Figma, Wireframes, Experiencia de Usuario)', icon: '🎨' },
]

const OPCIONES_EXPERIENCIA = [
  { value: 'si', label: 'Sí, tengo experiencia', icon: '✓' },
  { value: 'basico', label: 'Tengo conocimientos básicos', icon: '📚' },
  { value: 'no', label: 'No, es mi primer acercamiento', icon: '🌱' },
]

const OPCIONES_COMPROMISO = [
  { value: 'alto', label: 'Muy comprometido, puedo dedicar muchas horas', icon: '🔥' },
  { value: 'moderado', label: 'Moderadamente comprometido', icon: '⚖️' },
]

export function PerfilStep({ data, onNext, onBack }) {
  const [formData, setFormData] = useState({
    areaInteres: data.areaInteres || '',
    experienciaPrevia: data.experienciaPrevia || '',
    nivelCompromiso: data.nivelCompromiso || '',
  })

  const [errors, setErrors] = useState({})

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.areaInteres) newErrors.areaInteres = 'Selecciona un área de interés'
    if (!formData.experienciaPrevia) newErrors.experienciaPrevia = 'Selecciona tu nivel de experiencia'
    if (!formData.nivelCompromiso) newErrors.nivelCompromiso = 'Selecciona tu nivel de compromiso'

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
          <h2 className={styles.stepTitle}>Encuesta de Perfil</h2>
          <p className={styles.stepSubtitle}>Ayúdanos a conocer tu perfil profesional</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Área de interés */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <Briefcase size={20} />
              ¿Cuál es tu área de mayor interés?
            </label>
            <div className={styles.optionsGrid}>
              {OPCIONES_AREA.map((opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => handleSelect('areaInteres', opcion.value)}
                  className={`${styles.optionCard} ${
                    formData.areaInteres === opcion.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionIcon}>{opcion.icon}</span>
                  <span className={styles.optionLabel}>{opcion.label}</span>
                </button>
              ))}
            </div>
            {errors.areaInteres && (
              <span className={styles.errorText}>{errors.areaInteres}</span>
            )}
          </div>

          {/* Experiencia previa */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <BookOpen size={20} />
              ¿Tienes experiencia previa en tu área de interés?
            </label>
            <div className={styles.optionsGrid}>
              {OPCIONES_EXPERIENCIA.map((opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => handleSelect('experienciaPrevia', opcion.value)}
                  className={`${styles.optionCard} ${
                    formData.experienciaPrevia === opcion.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionIcon}>{opcion.icon}</span>
                  <span className={styles.optionLabel}>{opcion.label}</span>
                </button>
              ))}
            </div>
            {errors.experienciaPrevia && (
              <span className={styles.errorText}>{errors.experienciaPrevia}</span>
            )}
          </div>

          {/* Nivel de compromiso */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <Clock size={20} />
              ¿Cuál es tu nivel de compromiso?
            </label>
            <div className={styles.optionsGrid}>
              {OPCIONES_COMPROMISO.map((opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => handleSelect('nivelCompromiso', opcion.value)}
                  className={`${styles.optionCard} ${
                    formData.nivelCompromiso === opcion.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionIcon}>{opcion.icon}</span>
                  <span className={styles.optionLabel}>{opcion.label}</span>
                </button>
              ))}
            </div>
            {errors.nivelCompromiso && (
              <span className={styles.errorText}>{errors.nivelCompromiso}</span>
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