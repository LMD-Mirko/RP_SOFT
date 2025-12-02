import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Textarea } from '@shared/components/Textarea'
import { Select } from '@shared/components/Select'
import { Shield, CheckCircle } from 'lucide-react'
import styles from './RoleModal.module.css'

export function RoleModal({ isOpen, onClose, onSave, role, isEditing }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (role && isEditing) {
      setFormData({
        name: role.name || '',
        slug: role.slug || '',
        description: role.description || '',
        is_active: role.is_active !== undefined ? role.is_active : true,
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true,
      })
    }
    setErrors({})
  }, [role, isEditing, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.slug.trim()) newErrors.slug = 'El slug es requerido'
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
    }
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
      title={isEditing ? 'Editar Rol' : 'Nuevo Rol'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <Input
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Ej: Moderador"
          />
          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            error={errors.slug}
            required
            placeholder="Ej: moderador"
            helperText="Solo letras minúsculas, números y guiones"
          />
        </div>

        <Textarea
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Descripción del rol..."
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

