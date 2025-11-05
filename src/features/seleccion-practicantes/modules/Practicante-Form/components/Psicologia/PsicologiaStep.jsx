import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Users, AlertCircle, Target } from 'lucide-react'
import styles from './PsicologiaStep.module.css'

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
  { value: 'Me Motivan', label: 'Me Motivan' },
  { value: 'Me Generan estrés', label: 'Me Generan estrés' },
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
              ¿Cómo describes tu capacidad para trabajar en equipo?
            </label>
            <div className={styles.optionsList}>
              {OPCIONES_TRABAJO_EQUIPO.map((opcion) => (
                <div
                  key={opcion.value}
                  className={`${styles.checkboxOption} ${
                    formData.trabajoEquipo === opcion.value ? styles.checkboxOptionSelected : ''
                  }`}
                  onClick={() => handleSelect('trabajoEquipo', opcion.value)}
                >
                  <input
                    type="checkbox"
                    checked={formData.trabajoEquipo === opcion.value}
                    onChange={() => handleSelect('trabajoEquipo', opcion.value)}
                    className={styles.checkbox}
                  />
                  <label className={styles.checkboxLabel}>{opcion.label}</label>
                </div>
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
            <div className={styles.optionsList}>
              {OPCIONES_MANEJO_CONFLICTOS.map((opcion) => (
                <div
                  key={opcion.value}
                  className={`${styles.checkboxOption} ${
                    formData.manejoConflictos === opcion.value ? styles.checkboxOptionSelected : ''
                  }`}
                  onClick={() => handleSelect('manejoConflictos', opcion.value)}
                >
                  <input
                    type="checkbox"
                    checked={formData.manejoConflictos === opcion.value}
                    onChange={() => handleSelect('manejoConflictos', opcion.value)}
                    className={styles.checkbox}
                  />
                  <label className={styles.checkboxLabel}>{opcion.label}</label>
                </div>
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
            <div className={styles.optionsList}>
              {OPCIONES_ACTITUD_DESAFIOS.map((opcion) => (
                <div
                  key={opcion.value}
                  className={`${styles.checkboxOption} ${
                    formData.actitudDesafios === opcion.value ? styles.checkboxOptionSelected : ''
                  }`}
                  onClick={() => handleSelect('actitudDesafios', opcion.value)}
                >
                  <input
                    type="checkbox"
                    checked={formData.actitudDesafios === opcion.value}
                    onChange={() => handleSelect('actitudDesafios', opcion.value)}
                    className={styles.checkbox}
                  />
                  <label className={styles.checkboxLabel}>{opcion.label}</label>
                </div>
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