import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Textarea } from '@shared/components/Textarea'
import { Select } from '@shared/components/Select'
import { FileText, CheckCircle } from 'lucide-react'
import styles from './DocumentTypeModal.module.css'

export function DocumentTypeModal({ isOpen, onClose, onSave, documentType, isEditing }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (documentType && isEditing) {
      setFormData({
        name: documentType.name || '',
        description: documentType.description || '',
        is_active: documentType.is_active !== undefined ? documentType.is_active : true,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        is_active: true,
      })
    }
    setErrors({})
  }, [documentType, isEditing, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Tipo de Documento' : 'Nuevo Tipo de Documento'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Ej: DNI"
          icon={FileText}
          iconPosition="left"
        />

        <Textarea
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Descripción del tipo de documento..."
        />

        <Select
          label="Estado"
          name="is_active"
          value={formData.is_active ? 'true' : 'false'}
          onChange={(e) => {
            const value = e.target.value === 'true'
            setFormData(prev => ({ ...prev, is_active: value }))
            if (errors.is_active) {
              setErrors(prev => ({ ...prev, is_active: '' }))
            }
          }}
          options={[
            { value: 'true', label: 'Activo' },
            { value: 'false', label: 'Inactivo' },
          ]}
          icon={CheckCircle}
          iconPosition="left"
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

