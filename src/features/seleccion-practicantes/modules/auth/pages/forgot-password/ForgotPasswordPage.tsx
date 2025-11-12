import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import { checkEmail, passwordResetRequest } from '../../services/authService'
import styles from '../login/LoginPage.module.css'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email) {
      const errorMsg = 'Por favor ingresa tu email'
      setError(errorMsg)
      toast.error(errorMsg, 3000, 'Error de validación')
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const errorMsg = 'Por favor ingresa un email válido'
      setError(errorMsg)
      toast.error(errorMsg, 3000, 'Email inválido')
      setIsLoading(false)
      return
    }

    try {
      // 1. Verificar que el email existe
      toast.info('Verificando email...', 2000, 'Verificación')
      await checkEmail(email)

      // Esperar un momento para que se oculte el toast de verificación
      await new Promise(resolve => setTimeout(resolve, 500))

      // 2. Enviar código de reset automáticamente después de verificar
      toast.info('Enviando código de verificación...', 2000, 'Enviando código')
      await passwordResetRequest(email)

      // Esperar un momento antes de mostrar el éxito
      await new Promise(resolve => setTimeout(resolve, 500))

      toast.success('Código de verificación enviado a tu email', 4000, 'Código enviado')
      
      // Redirigir a la página de confirmación con el email
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 1000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al procesar la solicitud'
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
            <h1 className={styles.title}>Recuperar Contraseña</h1>
            <p className={styles.subtitle}>Ingresa tu email para recibir el código de verificación</p>
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

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? 'Procesando...' : 'Enviar Código'}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
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

