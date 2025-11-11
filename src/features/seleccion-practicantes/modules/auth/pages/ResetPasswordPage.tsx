import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import { passwordResetConfirm } from '../services/authService'
import styles from './LoginPage.module.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Obtener email del state de navegación
    const emailFromState = location.state?.email
    if (emailFromState) {
      setEmail(emailFromState)
    } else {
      // Si no hay email, redirigir a forgot-password
      toast.warning('Por favor ingresa tu email primero', 3000, 'Email requerido')
      navigate('/forgot-password')
    }
  }, [location, navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !code || !newPassword || !confirmPassword) {
      const errorMsg = 'Por favor completa todos los campos'
      setError(errorMsg)
      toast.error(errorMsg, 3000, 'Error de validación')
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      const errorMsg = 'La contraseña debe tener al menos 6 caracteres'
      setError(errorMsg)
      toast.error(errorMsg, 3000, 'Contraseña débil')
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      const errorMsg = 'Las contraseñas no coinciden'
      setError(errorMsg)
      toast.error(errorMsg, 3000, 'Error de validación')
      setIsLoading(false)
      return
    }

    try {
      toast.info('Cambiando contraseña...', 2000, 'Procesando')
      
      await passwordResetConfirm({
        email,
        code,
        new_password: newPassword,
      })

      toast.success('¡Contraseña cambiada exitosamente!', 4000, '¡Éxito!')
      
      // Redirigir al login después de 1 segundo
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cambiar la contraseña'
      setError(errorMsg)
      toast.error(errorMsg, 4000, 'Error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.blob}></div>
        <div className={`${styles.blob} ${styles.blobDelay1}`}></div>
        <div className={`${styles.blob} ${styles.blobDelay2}`}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoText}>RP</span>
            </div>
            <h1 className={styles.title}>Nueva Contraseña</h1>
            <p className={styles.subtitle}>Ingresa el código recibido y tu nueva contraseña</p>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={styles.input}
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Código de Verificación</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className={styles.input}
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                disabled={isLoading}
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              <Link 
                to="/forgot-password" 
                className={styles.link}
                style={{ 
                  fontWeight: 600,
                  color: '#3b82f6',
                  textDecoration: 'underline'
                }}
              >
                ¿No recibiste el código? Reenviar código
              </Link>
            </p>
            <p className={styles.footerText} style={{ marginTop: '0.75rem' }}>
              ¿Recordaste tu contraseña?{' '}
              <Link to="/" className={styles.link}>
                Iniciar sesión
              </Link>
            </p>
          </div>

          <p className={styles.disclaimer}>Plataforma segura de selección de practicantes SENATI</p>
        </div>
      </div>
    </div>
  )
}

