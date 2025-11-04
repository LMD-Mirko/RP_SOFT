import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Users, AlertCircle, Target } from 'lucide-react'
import styles from './StepForm.module.css'

const OPCIONES_TRABAJO_EQUIPO = [
  { value: 'Excelente', label: 'Excelente' },
  { value: 'Bueno', label: 'Bueno' },
  { value: 'Regular', label: 'Regular' },
]

const OPCIONES_MANEJO_CONFLICTOS = [
  { value: 'Busco soluciones constructivas', label: 'Busco soluciones constructivas' },
  { value: 'Evito confrontaciones', label: 'Evito confrontaciones' },
  { value: 'Necesito apoyo', label: 'Necesito apoyo' },
]

const OPCIONES_ACTITUD_DESAFIOS = [
  { value: 'Los veo como oportunidades', label: 'Los veo como oportunidades' },
]

export function PsicologiaStep({ data, onNext, onBack }) {
  const [formData, setFormData] = useState({
    trabajoEquipo: data.trabajoEquipo || '',
    manejoConflictos: data.manejoConflictos || '',
    actitudDesafios: data.actitudDesafios || '',
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
    
    if (!formData.trabajoEquipo) newErrors.trabajoEquipo = 'Selecciona una opción'
    if (!formData.manejoConflictos) newErrors.manejoConflictos = 'Selecciona una opción'
    if (!formData.actitudDesafios) newErrors.actitudDesafios = 'Selecciona una opción'

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
          <h2 className={styles.stepTitle}>Encuesta Psicológica</h2>
          <p className={styles.stepSubtitle}>Conoceremos más sobre tu personalidad y compatibilidad con el equipo</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Trabajo en equipo */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <Users size={20} />
              ¿Cómo describes tu capacidad para trabajar em equipo?
            </label>
            <div className={styles.optionsGrid}>
              {OPCIONES_TRABAJO_EQUIPO.map((opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => handleSelect('trabajoEquipo', opcion.value)}
                  className={`${styles.optionCard} ${
                    formData.trabajoEquipo === opcion.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionLabel}>{opcion.label}</span>
                </button>
              ))}
            </div>
            {errors.trabajoEquipo && (
              <span className={styles.errorText}>{errors.trabajoEquipo}</span>
            )}
          </div>

          {/* Manejo de conflictos */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <AlertCircle size={20} />
              ¿Cómo manejas conflictos en el trabajo?
            </label>
            <div className={styles.optionsGrid}>
              {OPCIONES_MANEJO_CONFLICTOS.map((opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => handleSelect('manejoConflictos', opcion.value)}
                  className={`${styles.optionCard} ${
                    formData.manejoConflictos === opcion.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionLabel}>{opcion.label}</span>
                </button>
              ))}
            </div>
            {errors.manejoConflictos && (
              <span className={styles.errorText}>{errors.manejoConflictos}</span>
            )}
          </div>

          {/* Actitud ante desafíos */}
          <div className={styles.questionGroup}>
            <label className={styles.questionLabel}>
              <Target size={20} />
              ¿Cuál es tu actitud ante los desafíos?
            </label>
            <div className={styles.optionsGrid}>
              {OPCIONES_ACTITUD_DESAFIOS.map((opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => handleSelect('actitudDesafios', opcion.value)}
                  className={`${styles.optionCard} ${
                    formData.actitudDesafios === opcion.value ? styles.optionCardSelected : ''
                  }`}
                >
                  <span className={styles.optionLabel}>{opcion.label}</span>
                </button>
              ))}
            </div>
            {errors.actitudDesafios && (
              <span className={styles.errorText}>{errors.actitudDesafios}</span>
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