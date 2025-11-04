import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Code } from 'lucide-react'
import styles from './StepForm.module.css'

const NIVELES = [
  { value: 'Basico', label: 'Básico' },
  { value: 'Intermedio', label: 'Intermedio' },
  { value: 'Avanzado', label: 'Avanzado' },
]

export function TecnicaStep({ data, onNext, onBack }) {
  const [formData, setFormData] = useState({
    nivelHTML: data.nivelHTML || '',
    nivelCSS: data.nivelCSS || '',
    nivelJavaScript: data.nivelJavaScript || '',
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
    
    if (!formData.nivelHTML) newErrors.nivelHTML = 'Selecciona tu nivel en HTML'
    if (!formData.nivelCSS) newErrors.nivelCSS = 'Selecciona tu nivel en CSS'
    if (!formData.nivelJavaScript) newErrors.nivelJavaScript = 'Selecciona tu nivel en JavaScript'

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
          <h2 className={styles.stepTitle}>Encuesta Técnica</h2>
          <p className={styles.stepSubtitle}>Ayúdanos a conocer tu conocimiento en frontend</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* HTML */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <Code size={20} />
              ¿Cuál es tu nivel en HTML?
            </label>
            <div className={styles.optionsGrid}>
              {NIVELES.map((nivel) => (
                <button
                  key={nivel.value}
                  type="button"
                  onClick={() => handleSelect('nivelHTML', nivel.value)}
                  className={`${styles.optionCard} ${
                    formData.nivelHTML === nivel.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionLabel}>{nivel.label}</span>
                </button>
              ))}
            </div>
            {errors.nivelHTML && (
              <span className={styles.errorText}>{errors.nivelHTML}</span>
            )}
          </div>

          {/* CSS */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <Code size={20} />
              ¿Cual es tu nivel en CSS?
            </label>
            <div className={styles.optionsGrid}>
              {NIVELES.map((nivel) => (
                <button
                  key={nivel.value}
                  type="button"
                  onClick={() => handleSelect('nivelCSS', nivel.value)}
                  className={`${styles.optionCard} ${
                    formData.nivelCSS === nivel.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionLabel}>{nivel.label}</span>
                </button>
              ))}
            </div>
            {errors.nivelCSS && (
              <span className={styles.errorText}>{errors.nivelCSS}</span>
            )}
          </div>

          {/* JavaScript */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <Code size={20} />
              ¿Cuál es tu nivel en JavaScript?
            </label>
            <div className={styles.optionsGrid}>
              {NIVELES.map((nivel) => (
                <button
                  key={nivel.value}
                  type="button"
                  onClick={() => handleSelect('nivelJavaScript', nivel.value)}
                  className={`${styles.optionCard} ${
                    formData.nivelJavaScript === nivel.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionLabel}>{nivel.label}</span>
                </button>
              ))}
            </div>
            {errors.nivelJavaScript && (
              <span className={styles.errorText}>{errors.nivelJavaScript}</span>
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