import { useState, useEffect } from 'react'
import { X, Mail, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import styles from './ChangeEmailModal.module.css'

export function ChangeEmailModal({ isOpen, onClose, onRequestChange, onConfirmChange, loading, canChangeEmail, provider, currentEmail }) {
  const toast = useToast()
  const [step, setStep] = useState(1) // 1: Solicitar cambio, 2: Confirmar con código
  const [formData, setFormData] = useState({
    new_email: '',
    code: '',
  })
  const [errors, setErrors] = useState({})
  const [countdown, setCountdown] = useState(0)
  const [isRequesting, setIsRequesting] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setFormData({
        new_email: '',
        code: '',
      })
      setErrors({})
      setCountdown(0)
      setIsRequesting(false)
      setIsConfirming(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    // Si es el campo de código, solo permitir números
    if (name === 'code') {
      const numericValue = value.replace(/\D/g, '')
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateEmail = () => {
    const newErrors = {}
    if (!formData.new_email.trim()) {
      newErrors.new_email = 'El nuevo email es requerido'
      toast.error('El nuevo email es requerido', 3000, 'Error de validación')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.new_email)) {
      newErrors.new_email = 'El formato del email no es válido'
      toast.error('El formato del email no es válido', 3000, 'Error de validación')
    } else if (formData.new_email.toLowerCase() === currentEmail?.toLowerCase()) {
      newErrors.new_email = 'El nuevo email debe ser diferente al actual'
      toast.warning('El nuevo email debe ser diferente al actual', 3000, 'Email inválido')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCode = () => {
    const newErrors = {}
    if (!formData.code.trim()) {
      newErrors.code = 'El código de verificación es requerido'
      toast.error('El código de verificación es requerido', 3000, 'Error de validación')
    } else if (!/^\d{6}$/.test(formData.code.trim())) {
      newErrors.code = 'El código debe tener 6 dígitos'
      toast.error('El código debe tener exactamente 6 dígitos', 3000, 'Error de validación')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRequestChange = async (e) => {
    e.preventDefault()
    if (!validateEmail()) return

    setIsRequesting(true)
    try {
      await onRequestChange(formData.new_email)
      setStep(2)
      setCountdown(900) // 15 minutos en segundos
      setErrors({})
      toast.info('Revisa tu email actual para obtener el código de verificación', 5000, 'Código enviado')
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setIsRequesting(false)
    }
  }

  const handleConfirmChange = async (e) => {
    e.preventDefault()
    if (!validateCode()) return

    setIsConfirming(true)
    try {
      await onConfirmChange(formData.code.trim())
      handleClose()
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setIsConfirming(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    setIsRequesting(true)
    try {
      await onRequestChange(formData.new_email)
      setCountdown(900) // Reiniciar contador
      setErrors({})
      toast.info('Código reenviado. Revisa tu email actual', 4000, 'Código reenviado')
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setIsRequesting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      new_email: '',
      code: '',
    })
    setErrors({})
    setCountdown(0)
    onClose()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!canChangeEmail) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>Cambiar Email</h2>
            <button className={styles.closeButton} onClick={handleClose}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.warningMessage}>
              <AlertCircle size={24} />
              <div>
                <h3>No puedes cambiar tu email</h3>
                <p>
                  Tu cuenta está vinculada con {provider === 'google' ? 'Google' : provider === 'microsoft' ? 'Microsoft' : provider}.
                  Para cambiar tu email, debes hacerlo desde tu cuenta de {provider === 'google' ? 'Google' : provider === 'microsoft' ? 'Microsoft' : provider}.
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
            <Mail size={20} />
            <h2 className={styles.title}>Cambiar Email</h2>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestChange} className={styles.form}>
            <div className={styles.infoBox}>
              <Info size={18} />
              <div>
                <p><strong>Proceso de cambio de email:</strong></p>
                <ol className={styles.stepsList}>
                  <li>Ingresa tu nuevo email</li>
                  <li>Recibirás un código de verificación en tu email actual</li>
                  <li>Ingresa el código para confirmar el cambio</li>
                </ol>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <Input
                label="Email Actual"
                id="current_email"
                name="current_email"
                type="email"
                value={currentEmail || ''}
                disabled
                icon={Mail}
                iconPosition="left"
              />
            </div>

            <div className={styles.inputGroup}>
              <Input
                label="Nuevo Email"
                id="new_email"
                name="new_email"
                type="email"
                value={formData.new_email}
                onChange={handleChange}
                icon={Mail}
                iconPosition="left"
                error={errors.new_email}
                required
                disabled={loading || isRequesting}
                placeholder="nuevo@example.com"
              />
            </div>

            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={loading || isRequesting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || isRequesting}
                icon={Mail}
              >
                {loading || isRequesting ? 'Enviando...' : 'Enviar Código'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirmChange} className={styles.form}>
            <div className={styles.successBox}>
              <CheckCircle size={20} />
              <div>
                <p><strong>Código enviado</strong></p>
                <p>Revisa tu email actual ({currentEmail}) para obtener el código de verificación de 6 dígitos.</p>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <Input
                label="Código de Verificación"
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                error={errors.code}
                required
                disabled={loading || isConfirming}
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
              />
              <p className={styles.codeHint}>
                Ingresa el código de 6 dígitos que recibiste en tu email
              </p>
            </div>

            {countdown > 0 && (
              <div className={styles.countdownBox}>
                <Info size={16} />
                <span>El código expira en: <strong>{formatTime(countdown)}</strong></span>
              </div>
            )}

            <div className={styles.resendBox}>
              <p>¿No recibiste el código?</p>
              <button
                type="button"
                className={styles.resendButton}
                onClick={handleResendCode}
                disabled={loading || isRequesting || countdown > 0}
              >
                {countdown > 0 ? `Reenviar en ${formatTime(countdown)}` : isRequesting ? 'Reenviando...' : 'Reenviar código'}
              </button>
            </div>

            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setStep(1)
                  setFormData(prev => ({ ...prev, code: '' }))
                  setErrors({})
                }}
                disabled={loading || isConfirming}
              >
                Volver
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || isConfirming}
                icon={CheckCircle}
              >
                {loading || isConfirming ? 'Confirmando...' : 'Confirmar Cambio'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

