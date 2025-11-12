import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import styles from './LoginPage.module.css'
import { useMicrosoftOAuth } from '../hooks/useMicrosoftOAuth'
import { useAuth } from '../hooks/authHook'

export default function LoginPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login: loginUser, error: authError, isLoading: authLoading } = useAuth()

  const {
    handleMicrosoftAuth,
    isLoading: isOAuthLoading,
    error: oauthError,
  } = useMicrosoftOAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      const errorMsg = 'Por favor completa todos los campos'
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
      const credentials = {
        email,
        password,
      }

      const response = await loginUser(credentials)
      
      // El hook useAuth ya maneja la obtención del rol y la redirección
      const userName = response.user?.name || response.user?.email || email
      toast.success(`¡Bienvenido, ${userName}!`, 3000, 'Sesión iniciada')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(errorMsg)
      toast.error(errorMsg, 4000, 'Error al iniciar sesión')
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
            <h1 className={styles.title}>RPsoft</h1>
            <p className={styles.subtitle}>Sistema de Selección de Practicantes</p>
          </div>

          {(error || oauthError || authError) && (
            <div className={styles.errorAlert}>
              <p className={styles.errorText}>{error || oauthError || authError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={async () => {
              try {
                toast.info('Conectando con Microsoft...', 2000, 'Autenticación')
                await handleMicrosoftAuth()
              } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Error al autenticar con Microsoft'
                setError(errorMsg)
                toast.error(errorMsg, 4000, 'Error de autenticación')
              }
            }}
            disabled={isOAuthLoading || isLoading}
            className={styles.microsoftButton}
          >
            <svg className={styles.microsoftIcon} viewBox="0 0 23 23" fill="none">
              <path d="M0 0h11v11H0V0z" fill="#F25022" />
              <path d="M12 0h11v11H12V0z" fill="#7FBA00" />
              <path d="M0 12h11v11H0V12z" fill="#00A4EF" />
              <path d="M12 12h11v11H12V12z" fill="#FFB900" />
            </svg>
            {isOAuthLoading ? 'Conectando con Microsoft...' : 'Iniciar sesión con Microsoft'}
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerText}>
              <span>O continúa con email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={isLoading || authLoading} className={styles.submitButton}>
              {isLoading || authLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              <Link to="/forgot-password" className={styles.link}>
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
            <p className={styles.footerText} style={{ marginTop: '0.5rem' }}>
              ¿No tienes cuenta?{' '}
              <Link to="/register" className={styles.link}>
                Crear cuenta
              </Link>
            </p>
          </div>

          <p className={styles.disclaimer}>Plataforma segura de selección de practicantes SENATI</p>
        </div>
      </div>
    </div>
  )
}
