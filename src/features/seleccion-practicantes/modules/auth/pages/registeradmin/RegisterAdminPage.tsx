import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import styles from './RegisterAdminPage.module.css'
import { useGoogleOAuth } from '../../hooks/useGoogleOAuth'
import { useMicrosoftOAuth } from '../../hooks/useMicrosoftOAuth'
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
    handleGoogleRegister,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleOAuth()

  const {
    handleMicrosoftRegister,
    isLoading: isMicrosoftLoading,
    error: microsoftError,
  } = useMicrosoftOAuth()

  const isOAuthLoading = isGoogleLoading || isMicrosoftLoading
  const oauthError = googleError || microsoftError

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

      // Redirigir según role_id y postulant_status del usuario
      // Los datos ya vienen en response.user según la nueva API
      if (response.user) {
        const userData = {
          ...response.user,
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('rpsoft_user', JSON.stringify(userData))
        
        const userName = response.user?.name || nameParts.firstName.trim()
        toast.success(`¡Cuenta de administrador creada exitosamente! Bienvenido, ${userName}`, 4000, '¡Registro exitoso!')
        
        // Redirigir según el rol
        setTimeout(() => {
          redirectByRole(response.user, navigate)
        }, 1000)
      } else {
        // Fallback: intentar obtener datos del rol si no vienen en response.user
        try {
          const roleData = await getUserRole()
          if (roleData) {
            const userData = JSON.parse(localStorage.getItem('rpsoft_user') || '{}')
            const updatedUserData = {
              ...userData,
              ...roleData,
              loginTime: new Date().toISOString(),
            }
            localStorage.setItem('rpsoft_user', JSON.stringify(updatedUserData))
            
            const userName = nameParts.firstName.trim()
            toast.success(`¡Cuenta de administrador creada exitosamente! Bienvenido, ${userName}`, 4000, '¡Registro exitoso!')
            
            setTimeout(() => {
              redirectByRole(updatedUserData, navigate)
            }, 1000)
          } else {
            const userName = nameParts.firstName.trim()
            toast.success(`¡Cuenta de administrador creada exitosamente! Bienvenido, ${userName}`, 4000, '¡Registro exitoso!')
            
            setTimeout(() => {
              navigate('/dashboard')
            }, 1000)
          }
        } catch (roleError) {
          const userName = nameParts.firstName.trim()
          toast.success(`¡Cuenta de administrador creada exitosamente! Bienvenido, ${userName}`, 4000, '¡Registro exitoso!')
          
          setTimeout(() => {
            navigate('/dashboard')
          }, 1000)
        }
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
              onClick={async () => {
                try {
                  toast.info('Conectando con Google...', 2000, 'Registro')
                  await handleGoogleRegister(undefined, 2)
                } catch (err) {
                  const errorMsg = err instanceof Error ? err.message : 'Error al registrar con Google'
                  setError(errorMsg)
                  toast.error(errorMsg, 4000, 'Error de autenticación')
                }
              }}
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
              onClick={async () => {
                try {
                  toast.info('Conectando con Microsoft...', 2000, 'Registro')
                  await handleMicrosoftRegister(undefined, 2)
                } catch (err) {
                  const errorMsg = err instanceof Error ? err.message : 'Error al registrar con Microsoft'
                  setError(errorMsg)
                  toast.error(errorMsg, 4000, 'Error de autenticación')
                }
              }}
              disabled={isOAuthLoading || isLoading}
              className={styles.microsoftButton}
              title="Registrarse con Microsoft"
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

