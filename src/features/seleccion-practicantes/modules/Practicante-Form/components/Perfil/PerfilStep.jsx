import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Briefcase, BookOpen, Clock } from 'lucide-react'
import styles from './PerfilStep.module.css'

const OPCIONES_AREA = [
  { value: 'frontend', label: 'Desarrollo Frontend (HTML, CSS, JavaScript, React)' },
  { value: 'backend', label: 'Desarrollo Backend (Python, Django, Bases de datos)' },
  { value: 'ux', label: 'Diseño UX/UI (Figma, Wireframes, Experiencia de Usuario)' },
]

const OPCIONES_EXPERIENCIA = [
  { value: 'si', label: 'Sí, tengo experiencia' },
  { value: 'basico', label: 'Tengo conocimientos básicos' },
  { value: 'no', label: 'No, es mi primer acercamiento' },
]

const OPCIONES_COMPROMISO = [
  { value: 'alto', label: 'Muy comprometido, puedo dedicar muchas horas' },
  { value: 'moderado', label: 'Moderadamente comprometido' },
  { value: 'bajo', label: 'Disponibilidad limitada' },
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
            <div className={styles.optionsList}>
              {OPCIONES_AREA.map((opcion) => (
                <div
                  key={opcion.value}
                  className={`${styles.checkboxOption} ${
                    formData.areaInteres === opcion.value ? styles.checkboxOptionSelected : ''
                  }`}
                  onClick={() => handleSelect('areaInteres', opcion.value)}
                >
                  <input
                    type="checkbox"
                    checked={formData.areaInteres === opcion.value}
                    onChange={() => handleSelect('areaInteres', opcion.value)}
                    className={styles.checkbox}
                  />
                  <label className={styles.checkboxLabel}>{opcion.label}</label>
                </div>
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
            <div className={styles.optionsList}>
              {OPCIONES_EXPERIENCIA.map((opcion) => (
                <div
                  key={opcion.value}
                  className={`${styles.checkboxOption} ${
                    formData.experienciaPrevia === opcion.value ? styles.checkboxOptionSelected : ''
                  }`}
                  onClick={() => handleSelect('experienciaPrevia', opcion.value)}
                >
                  <input
                    type="checkbox"
                    checked={formData.experienciaPrevia === opcion.value}
                    onChange={() => handleSelect('experienciaPrevia', opcion.value)}
                    className={styles.checkbox}
                  />
                  <label className={styles.checkboxLabel}>{opcion.label}</label>
                </div>
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
            <div className={styles.optionsList}>
              {OPCIONES_COMPROMISO.map((opcion) => (
                <div
                  key={opcion.value}
                  className={`${styles.checkboxOption} ${
                    formData.nivelCompromiso === opcion.value ? styles.checkboxOptionSelected : ''
                  }`}
                  onClick={() => handleSelect('nivelCompromiso', opcion.value)}
                >
                  <input
                    type="checkbox"
                    checked={formData.nivelCompromiso === opcion.value}
                    onChange={() => handleSelect('nivelCompromiso', opcion.value)}
                    className={styles.checkbox}
                  />
                  <label className={styles.checkboxLabel}>{opcion.label}</label>
                </div>
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