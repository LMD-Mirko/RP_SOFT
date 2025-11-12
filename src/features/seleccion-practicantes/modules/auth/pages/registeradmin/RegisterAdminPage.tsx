import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import styles from './RegisterAdminPage.module.css'
import { useGoogleOAuth } from '../../hooks/useGoogleOAuth'
import { useGitHubOAuth } from '../../hooks/useGitHubOAuth'
import { useFacebookOAuth } from '../../hooks/useFacebookOAuth'
import { registerAdmin, getUserRole } from '../../services/authService'
import { setAuthTokens } from '../../../../shared/utils/cookieHelper'
import { redirectByRole } from '../../utils/redirectByRole'

export default function RegisterAdminPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [nameParts, setNameParts] = useState({ firstName: '', lastName: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    handleGoogleAuth,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleOAuth()

  const {
    handleGitHubAuth,
    isLoading: isGitHubLoading,
    error: githubError,
  } = useGitHubOAuth()

  const {
    handleFacebookAuth,
    isLoading: isFacebookLoading,
    error: facebookError,
  } = useFacebookOAuth()

  const isOAuthLoading = isGoogleLoading || isGitHubLoading || isFacebookLoading
  const oauthError = googleError || githubError || facebookError

  // Parsear el campo de nombres y apellidos para formato peruano
  useEffect(() => {
    const normalized = fullName.trim().replace(/\s+/g, ' ')

    if (!normalized) {
      setNameParts({ firstName: '', lastName: '' })
      return
    }

    let parsedFirstName = ''
    let parsedLastName = ''

    if (normalized.includes(',')) {
      const [firstSegment, lastSegment] = normalized.split(',').map((segment) => segment.trim())
      parsedFirstName = firstSegment || ''
      parsedLastName = lastSegment || ''
    } else {
      const parts = normalized.split(' ')

      if (parts.length === 1) {
        parsedFirstName = parts[0]
      } else if (parts.length === 2) {
        parsedFirstName = parts[0]
        parsedLastName = parts[1]
      } else {
        const nameCount = parts.length >= 4 ? 2 : 1
        parsedFirstName = parts.slice(0, nameCount).join(' ')
        parsedLastName = parts.slice(nameCount).join(' ')
      }
    }

    setNameParts({ firstName: parsedFirstName, lastName: parsedLastName })
  }, [fullName])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password || !confirmPassword || !fullName.trim()) {
      const errorMsg = 'Por favor completa todos los campos obligatorios'
      setError(errorMsg)
      toast.error(errorMsg, 3000, 'Error de validación')
      setIsLoading(false)
      return
    }

    if (!nameParts.firstName || !nameParts.lastName) {
      const errorMsg = 'Ingresa nombres y apellidos (por ejemplo: "Juan Carlos García López")'
      setError(errorMsg)
      toast.error(errorMsg, 4000, 'Formato incorrecto')
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

    if (password.length < 6) {
      const errorMsg = 'La contraseña debe tener al menos 6 caracteres'
      setError(errorMsg)
      toast.error(errorMsg, 3000, 'Contraseña débil')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      const errorMsg = 'Las contraseñas no coinciden'
      setError(errorMsg)
      toast.error(errorMsg, 3000, 'Error de validación')
      setIsLoading(false)
      return
    }

    try {
      const lastNameParts = nameParts.lastName.trim().split(' ')
      const paternalLastname = lastNameParts[0] || ''
      const maternalLastname = lastNameParts.slice(1).join(' ') || ''

      const userData = {
        email,
        password,
        name: nameParts.firstName.trim(),
        paternal_lastname: paternalLastname,
        maternal_lastname: maternalLastname,
      }

      toast.info('Creando tu cuenta de administrador...', 2000, 'Registro Admin')
      const response = await registerAdmin(userData)
      
      // Guardar tokens en cookies
      if (response.tokens) {
        const accessToken = response.tokens.access
        const refreshToken = response.tokens.refresh
        if (accessToken) {
          setAuthTokens(accessToken, refreshToken)
        }
      } else if (response.access_token || response.token) {
        // Compatibilidad con formato anterior
        const token = response.access_token || response.token
        setAuthTokens(token, null)
      }

      // Guardar datos del usuario
      if (response.user) {
        localStorage.setItem(
          'rpsoft_user',
          JSON.stringify({
            ...response.user,
            loginTime: new Date().toISOString(),
          })
        )
      }

      // Obtener el rol del usuario y redirigir
      try {
        const roleData = await getUserRole()
        if (roleData) {
          // Actualizar datos del usuario con información del rol
          const userData = JSON.parse(localStorage.getItem('rpsoft_user') || '{}')
          localStorage.setItem(
            'rpsoft_user',
            JSON.stringify({
              ...userData,
              ...roleData,
              loginTime: new Date().toISOString(),
            })
          )
          
          const userName = response.user?.name || nameParts.firstName.trim()
          toast.success(`¡Cuenta de administrador creada exitosamente! Bienvenido, ${userName}`, 4000, '¡Registro exitoso!')
          
          // Redirigir según el rol
          setTimeout(() => {
            redirectByRole(roleData, navigate)
          }, 1000)
        } else {
          // Si no hay datos de rol, redirigir a dashboard por defecto
          const userName = response.user?.name || nameParts.firstName.trim()
          toast.success(`¡Cuenta de administrador creada exitosamente! Bienvenido, ${userName}`, 4000, '¡Registro exitoso!')
          
          setTimeout(() => {
            navigate('/dashboard')
          }, 1000)
        }
      } catch (roleError) {
        // Si falla obtener el rol, redirigir a dashboard por defecto
        const userName = response.user?.name || nameParts.firstName.trim()
        toast.success(`¡Cuenta de administrador creada exitosamente! Bienvenido, ${userName}`, 4000, '¡Registro exitoso!')
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }

      // Limpiar datos temporales
      localStorage.removeItem('rpsoft_selection_data')
      localStorage.removeItem('rpsoft_current_step')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al registrar administrador'
      setError(errorMsg)
      toast.error(errorMsg, 4000, 'Error al registrar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      toast.info('Conectando con Google...', 2000, 'Registro')
      // role_id: 2 para registro de administrador
      await handleGoogleAuth(undefined, 2)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al autenticar con Google'
      setError(errorMsg)
      toast.error(errorMsg, 4000, 'Error de autenticación')
    }
  }

  const handleGitHubRegister = async () => {
    try {
      toast.info('Conectando con GitHub...', 2000, 'Registro')
      // role_id: 2 para registro de administrador
      await handleGitHubAuth(undefined, 2)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al autenticar con GitHub'
      setError(errorMsg)
      toast.error(errorMsg, 4000, 'Error de autenticación')
    }
  }

  const handleFacebookRegister = async () => {
    try {
      toast.info('Conectando con Facebook...', 2000, 'Registro')
      // role_id: 2 para registro de administrador
      await handleFacebookAuth(undefined, 2)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al autenticar con Facebook'
      setError(errorMsg)
      toast.error(errorMsg, 4000, 'Error de autenticación')
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
            <h1 className={styles.title}>Crear Cuenta Admin</h1>
            <p className={styles.subtitle}>Únete a RPsoft</p>
          </div>

          {(error || oauthError) && (
            <div className={styles.errorAlert}>
              <p className={styles.errorText}>{error || oauthError}</p>
            </div>
          )}

          <div className={styles.oauthButtons}>
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isOAuthLoading || isLoading}
              className={styles.googleButton}
              title="Registrarse con Google"
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
              onClick={handleGitHubRegister}
              disabled={isOAuthLoading || isLoading}
              className={styles.githubButton}
              title="Registrarse con GitHub"
            >
              <svg className={styles.githubIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={handleFacebookRegister}
              disabled={isOAuthLoading || isLoading}
              className={styles.facebookButton}
              title="Registrarse con Facebook"
            >
              <svg className={styles.facebookIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>

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
              <label className={styles.label}>Nombres y Apellidos</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ingrese nombres y apellidos"
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
              Acceso exclusivo para administradores
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

