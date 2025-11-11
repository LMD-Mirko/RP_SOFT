import type React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from './RegisterPage.module.css'
import { useMicrosoftOAuth } from '../hooks/useMicrosoftOAuth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    handleMicrosoftAuth,
    isLoading: isOAuthLoading,
    error: oauthError,
  } = useMicrosoftOAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos')
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      localStorage.setItem(
        'rpsoft_user',
        JSON.stringify({
          email,
          loginTime: new Date().toISOString(),
        }),
      )

      localStorage.removeItem('rpsoft_selection_data')
      localStorage.removeItem('rpsoft_current_step')

      navigate('/seleccion-practicantes')
      setIsLoading(false)
    }, 500)
  }

  const handleMicrosoftRegister = async () => {
    try {
      await handleMicrosoftAuth()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al autenticar con Microsoft')
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
            <h1 className={styles.title}>Crear Cuenta</h1>
            <p className={styles.subtitle}>Únete a RPsoft</p>
          </div>

          {(error || oauthError) && (
            <div className={styles.errorAlert}>
              <p className={styles.errorText}>{error || oauthError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleMicrosoftRegister}
            disabled={isOAuthLoading || isLoading}
            className={styles.microsoftButton}
          >
            <svg className={styles.microsoftIcon} viewBox="0 0 23 23" fill="none">
              <path d="M0 0h11v11H0V0z" fill="#F25022" />
              <path d="M12 0h11v11H12V0z" fill="#7FBA00" />
              <path d="M0 12h11v11H0V12z" fill="#00A4EF" />
              <path d="M12 12h11v11H12V12z" fill="#FFB900" />
            </svg>
            {isOAuthLoading ? 'Conectando con Microsoft...' : 'Registrarse con Microsoft'}
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerText}>
              <span>O continúa con email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className={styles.form}>
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

            <div className={styles.field}>
              <label className={styles.label}>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/seleccion-practicantes/auth/login" className={styles.link}>
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
