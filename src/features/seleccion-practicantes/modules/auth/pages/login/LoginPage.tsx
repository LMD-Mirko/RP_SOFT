import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import styles from './LoginPage.module.css'
import { useMicrosoftOAuth } from '../../hooks/useMicrosoftOAuth'
import { useGoogleOAuth } from '../../hooks/useGoogleOAuth'
import { useAuth } from '../../hooks/authHook'

export default function LoginPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Verificar si hay un error guardado en sessionStorage (por ejemplo, usuario inactivo)
  React.useEffect(() => {
    const savedError = sessionStorage.getItem('login_error')
    if (savedError) {
      setError(savedError)
      toast.error(savedError, 5000, 'Cuenta inactiva')
      sessionStorage.removeItem('login_error')
    }
  }, [toast])

  const { login: loginUser, error: authError, isLoading: authLoading } = useAuth()

  const {
    handleMicrosoftLogin,
    isLoading: isMicrosoftLoading,
    error: microsoftError,
  } = useMicrosoftOAuth()

  const {
    handleGoogleLogin,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleOAuth()

  const isOAuthLoading = isMicrosoftLoading || isGoogleLoading
  const oauthError = microsoftError || googleError

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

  const handleSkip = () => {
    navigate('/dashboard')
  }

  return (
    <div className={styles.container}>
      <button onClick={handleSkip} className={styles.skipButton}>
        Saltar
      </button>
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

          <div className={styles.oauthButtons}>
            <button
              type="button"
              onClick={async () => {
                try {
                  toast.info('Conectando con Google...', 2000, 'Autenticación')
                  await handleGoogleLogin()
                } catch (err: any) {
                  let errorMsg = 'Error al autenticar con Google'
                  
                  // Verificar si es un error 404
                  const status = err?.response?.status || err?.status || 
                                (err?.message?.includes('Error HTTP: 404') ? 404 : null)
                  
                  if (status === 404) {
                    errorMsg = 'No tienes una cuenta asociada con Google. Por favor, regístrate primero.'
                  } else if (err?.message?.includes('No se recibió respuesta')) {
                    errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
                  } else if (err instanceof Error) {
                    // Si el mensaje contiene "Error HTTP:", usar un mensaje más amigable
                    if (err.message.includes('Error HTTP:')) {
                      const statusMatch = err.message.match(/Error HTTP: (\d+)/)
                      if (statusMatch) {
                        const httpStatus = parseInt(statusMatch[1])
                        if (httpStatus === 404) {
                          errorMsg = 'No tienes una cuenta asociada con Google. Por favor, regístrate primero.'
                        } else if (httpStatus === 401) {
                          errorMsg = 'Credenciales inválidas. Por favor, intenta nuevamente.'
                        } else if (httpStatus >= 500) {
                          errorMsg = 'Error del servidor. Por favor, intenta más tarde.'
                        } else {
                          errorMsg = 'Error al autenticar con Google. Por favor, intenta nuevamente.'
                        }
                      } else {
                        errorMsg = 'Error al autenticar con Google. Por favor, intenta nuevamente.'
                      }
                    } else {
                      errorMsg = err.message
                    }
                  }
                  
                  setError(errorMsg)
                  toast.error(errorMsg, 4000, 'Error de autenticación')
                }
              }}
              disabled={isOAuthLoading || isLoading}
              className={styles.googleButton}
              title="Iniciar sesión con Google"
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={async () => {
                try {
                  toast.info('Conectando con Microsoft...', 2000, 'Autenticación')
                  await handleMicrosoftLogin()
                } catch (err: any) {
                  let errorMsg = 'Error al autenticar con Microsoft'
                  
                  // Verificar si es un error 404
                  const status = err?.response?.status || err?.status || 
                                (err?.message?.includes('Error HTTP: 404') ? 404 : null)
                  
                  if (status === 404) {
                    errorMsg = 'No tienes una cuenta asociada con Microsoft. Por favor, regístrate primero.'
                  } else if (err?.message?.includes('No se recibió respuesta')) {
                    errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
                  } else if (err instanceof Error) {
                    // Si el mensaje contiene "Error HTTP:", usar un mensaje más amigable
                    if (err.message.includes('Error HTTP:')) {
                      const statusMatch = err.message.match(/Error HTTP: (\d+)/)
                      if (statusMatch) {
                        const httpStatus = parseInt(statusMatch[1])
                        if (httpStatus === 404) {
                          errorMsg = 'No tienes una cuenta asociada con Microsoft. Por favor, regístrate primero.'
                        } else if (httpStatus === 401) {
                          errorMsg = 'Credenciales inválidas. Por favor, intenta nuevamente.'
                        } else if (httpStatus >= 500) {
                          errorMsg = 'Error del servidor. Por favor, intenta más tarde.'
                        } else {
                          errorMsg = 'Error al autenticar con Microsoft. Por favor, intenta nuevamente.'
                        }
                      } else {
                        errorMsg = 'Error al autenticar con Microsoft. Por favor, intenta nuevamente.'
                      }
                    } else {
                      errorMsg = err.message
                    }
                  }
                  
                  setError(errorMsg)
                  toast.error(errorMsg, 4000, 'Error de autenticación')
                }
              }}
              disabled={isOAuthLoading || isLoading}
              className={styles.microsoftButton}
              title="Iniciar sesión con Microsoft"
            >
              <svg className={styles.microsoftIcon} viewBox="0 0 23 23" fill="none">
                <path d="M0 0h11v11H0V0z" fill="#F25022" />
                <path d="M12 0h11v11H12V0z" fill="#7FBA00" />
                <path d="M0 12h11v11H0V12z" fill="#00A4EF" />
                <path d="M12 12h11v11H12V12z" fill="#FFB900" />
              </svg>
            </button>
          </div>

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
