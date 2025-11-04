import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import { Button } from '@shared/components/Button'
import { User, Award } from 'lucide-react'
import styles from './EvaluacionModal.module.css'

export function EvaluacionModal({ isOpen, onClose, onSave, evaluacion, postulantes = [] }) {
  const [formData, setFormData] = useState({
    postulante: '',
    prueba: '',
    puntaje: '',
  })

  useEffect(() => {
    if (evaluacion) {
      setFormData({
        postulante: evaluacion.postulante || '',
        prueba: evaluacion.prueba || '',
        puntaje: evaluacion.puntaje || '',
      })
    } else {
      setFormData({
        postulante: '',
        prueba: '',
        puntaje: '',
      })
    }
  }, [evaluacion, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...formData, id: evaluacion?.id })
    onClose()
  }

  const pruebaOptions = [
    { value: 'Prueba Técnica', label: 'Prueba Técnica' },
    { value: 'Entrevista', label: 'Entrevista' },
    { value: 'Evaluación Psicológica', label: 'Evaluación Psicológica' },
    { value: 'Evaluación de Conocimientos', label: 'Evaluación de Conocimientos' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={evaluacion ? 'Editar Evaluación' : 'Nueva Evaluación'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Postulante"
          id="postulante"
          name="postulante"
          value={formData.postulante}
          onChange={handleChange}
          placeholder="Nombre del postulante"
          icon={User}
          iconPosition="left"
          required
        />

        <Select
          label="Tipo de Prueba"
          id="prueba"
          name="prueba"
          value={formData.prueba}
          onChange={handleChange}
          options={pruebaOptions}
          placeholder="Seleccionar tipo de prueba"
          required
        />

        <Input
          label="Puntaje"
          type="number"
          id="puntaje"
          name="puntaje"
          value={formData.puntaje}
          onChange={handleChange}
          placeholder="0-100"
          icon={Award}
          iconPosition="left"
          min="0"
          max="100"
          required
        />

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            {evaluacion ? 'Guardar Cambios' : 'Crear Evaluación'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

