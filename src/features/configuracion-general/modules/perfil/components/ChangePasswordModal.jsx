import { useState, useEffect } from 'react'
import { X, Lock, Eye, EyeOff, AlertCircle, Info } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import styles from './ChangePasswordModal.module.css'

export function ChangePasswordModal({ isOpen, onClose, onChangePassword, loading, canChangePassword, provider }) {
  const toast = useToast()
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.current_password) {
      newErrors.current_password = 'La contraseña actual es requerida'
      toast.error('La contraseña actual es requerida', 3000, 'Error de validación')
    }
    if (!formData.new_password) {
      newErrors.new_password = 'La nueva contraseña es requerida'
      toast.error('La nueva contraseña es requerida', 3000, 'Error de validación')
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'La contraseña debe tener al menos 8 caracteres'
      toast.warning('La contraseña debe tener al menos 8 caracteres', 3000, 'Contraseña débil')
    } else if (formData.new_password.length < 12 && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.new_password)) {
      toast.info('Para mayor seguridad, combina letras mayúsculas, minúsculas y números', 4000, 'Recomendación')
    }
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Confirma la nueva contraseña'
      toast.error('Debes confirmar la nueva contraseña', 3000, 'Error de validación')
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Las contraseñas no coinciden'
      toast.error('Las contraseñas no coinciden', 3000, 'Error de validación')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onChangePassword(formData.current_password, formData.new_password)
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
      setErrors({})
      onClose()
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    })
    setErrors({})
    onClose()
  }

  if (!canChangePassword) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>Cambiar Contraseña</h2>
            <button className={styles.closeButton} onClick={handleClose}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.warningMessage}>
              <AlertCircle size={24} />
              <div>
                <h3>No puedes cambiar tu contraseña</h3>
                <p>
                  Tu cuenta está vinculada con {provider === 'google' ? 'Google' : provider === 'microsoft' ? 'Microsoft' : provider}.
                  Para cambiar tu contraseña, debes hacerlo desde tu cuenta de {provider === 'google' ? 'Google' : provider === 'microsoft' ? 'Microsoft' : provider}.
                </p>
              </div>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Lock size={20} />
            <h2 className={styles.title}>Cambiar Contraseña</h2>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.infoBox}>
            <Info size={18} />
            <p>Usa al menos 8 caracteres. Combina letras, números y símbolos para mayor seguridad.</p>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.passwordInputWrapper}>
              <Input
                label="Contraseña Actual"
                id="current_password"
                name="current_password"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.current_password}
                onChange={handleChange}
                icon={Lock}
                iconPosition="left"
                error={errors.current_password}
                required
                disabled={loading || isSubmitting}
                className={styles.passwordInput}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => togglePasswordVisibility('current')}
                tabIndex={-1}
                disabled={loading || isSubmitting}
                aria-label={showPasswords.current ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.passwordInputWrapper}>
              <Input
                label="Nueva Contraseña"
                id="new_password"
                name="new_password"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.new_password}
                onChange={handleChange}
                icon={Lock}
                iconPosition="left"
                error={errors.new_password}
                required
                disabled={loading || isSubmitting}
                className={styles.passwordInput}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => togglePasswordVisibility('new')}
                tabIndex={-1}
                disabled={loading || isSubmitting}
                aria-label={showPasswords.new ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.new_password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div
                    className={`${styles.strengthFill} ${
                      formData.new_password.length < 8
                        ? styles.weak
                        : formData.new_password.length < 12
                        ? styles.medium
                        : styles.strong
                    }`}
                    style={{
                      width: `${Math.min((formData.new_password.length / 16) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className={styles.strengthText}>
                  {formData.new_password.length < 8
                    ? 'Débil'
                    : formData.new_password.length < 12
                    ? 'Media'
                    : 'Fuerte'}
                </p>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.passwordInputWrapper}>
              <Input
                label="Confirmar Nueva Contraseña"
                id="confirm_password"
                name="confirm_password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirm_password}
                onChange={handleChange}
                icon={Lock}
                iconPosition="left"
                error={errors.confirm_password}
                required
                disabled={loading || isSubmitting}
                className={styles.passwordInput}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => togglePasswordVisibility('confirm')}
                tabIndex={-1}
                disabled={loading || isSubmitting}
                aria-label={showPasswords.confirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirm_password && formData.new_password === formData.confirm_password && (
              <div className={styles.passwordMatch}>
                <span>✓ Las contraseñas coinciden</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading || isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || isSubmitting}
              icon={Lock}
            >
              {loading || isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

