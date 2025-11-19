import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Select } from '@shared/components/Select'
import { User, Mail, Lock, Shield, ShieldCheck, UserCheck } from 'lucide-react'
import styles from './UserModal.module.css'

export function UserModal({ isOpen, onClose, onSave, user, isEditing }) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    paternal_lastname: '',
    maternal_lastname: '',
    role_id: 1,
    is_active: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        password: '',
        name: user.name || '',
        paternal_lastname: user.paternal_lastname || '',
        maternal_lastname: user.maternal_lastname || '',
        role_id: user.role_id || 1,
        is_active: user.is_active !== undefined ? user.is_active : true,
      })
    } else {
      setFormData({
        email: '',
        username: '',
        password: '',
        name: '',
        paternal_lastname: '',
        maternal_lastname: '',
        role_id: 1,
        is_active: true,
      })
    }
    setErrors({})
  }, [user, isEditing, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!isEditing && !formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.paternal_lastname.trim()) {
      newErrors.paternal_lastname = 'El apellido paterno es requerido'
    }
    if (!isEditing && !formData.username.trim()) {
      newErrors.username = 'El usuario es requerido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const dataToSave = { ...formData }
    // Si es edición y no hay nueva contraseña, no enviar el campo password
    if (isEditing && !dataToSave.password) {
      delete dataToSave.password
    }
    // Si es edición, no enviar username (no se puede cambiar)
    if (isEditing) {
      delete dataToSave.username
    }

    onSave(dataToSave)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          iconPosition="left"
          error={errors.email}
          required
        />

        {!isEditing && (
          <Input
            label="Usuario"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            icon={User}
            iconPosition="left"
            error={errors.username}
            required
          />
        )}

        {isEditing && (
          <Input
            label="Usuario"
            id="username"
            name="username"
            value={formData.username}
            disabled
            icon={User}
            iconPosition="left"
          />
        )}

        <Input
          label={isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
          iconPosition="left"
          error={errors.password}
          required={!isEditing}
        />

        <div className={styles.formRow}>
          <Input
            label="Nombre"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            iconPosition="left"
            error={errors.name}
            required
          />

          <Input
            label="Apellido Paterno"
            id="paternal_lastname"
            name="paternal_lastname"
            value={formData.paternal_lastname}
            onChange={handleChange}
            icon={User}
            iconPosition="left"
            error={errors.paternal_lastname}
            required
          />
        </div>

        <Input
          label="Apellido Materno"
          id="maternal_lastname"
          name="maternal_lastname"
          value={formData.maternal_lastname}
          onChange={handleChange}
          icon={User}
          iconPosition="left"
        />

        <div className={styles.formRow}>
          <Select
            label="Rol"
            id="role_id"
            name="role_id"
            value={formData.role_id.toString()}
            onChange={(e) => setFormData(prev => ({ ...prev, role_id: parseInt(e.target.value) }))}
            options={[
              { value: '1', label: 'Postulante', Icon: UserCheck },
              { value: '2', label: 'Administrador', Icon: ShieldCheck },
            ]}
            icon={Shield}
            iconPosition="left"
          />

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Usuario activo</span>
            </label>
          </div>
        </div>

        {/* Actions */}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

