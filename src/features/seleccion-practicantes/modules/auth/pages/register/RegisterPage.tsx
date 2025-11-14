import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import styles from './RegisterPage.module.css'
import { useMicrosoftOAuth } from '../../hooks/useMicrosoftOAuth'
import { useAuth } from '../../hooks/authHook'

export default function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [nameParts, setNameParts] = useState({ firstName: '', lastName: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register: registerUser, error: authError, isLoading: authLoading } = useAuth()

  const {
    handleMicrosoftRegister,
    isLoading: isOAuthLoading,
    error: oauthError,
  } = useMicrosoftOAuth()

  // Parsear el campo de nombres y apellidos para formato peruano
  // Formato esperado: "Nombres Apellidos" (nombres primero, apellidos después)
  useEffect(() => {
    const normalized = fullName.trim().replace(/\s+/g, ' ')

    if (!normalized) {
      setNameParts({ firstName: '', lastName: '' })
      return
    }

    let parsedFirstName = ''
    let parsedLastName = ''

    if (normalized.includes(',')) {
      // Formato: "Nombres, Apellidos"
      const [firstSegment, lastSegment] = normalized.split(',').map((segment) => segment.trim())
      parsedFirstName = firstSegment || ''
      parsedLastName = lastSegment || ''
    } else {
      // Formato: "Nombres Apellidos" (formato peruano típico)
      const parts = normalized.split(' ')

      if (parts.length === 1) {
        // Solo un nombre/apellido - asumimos que es nombre
        parsedFirstName = parts[0]
      } else if (parts.length === 2) {
        // "Nombre Apellido" - el primero es nombre, el segundo es apellido
        parsedFirstName = parts[0]
        parsedLastName = parts[1]
      } else {
        // 3 o más partes: "Nombres Apellido Paterno Apellido Materno"
        // En Perú, típicamente los primeros 1-2 son nombres, el resto son apellidos
        // Asumimos que los primeros 1-2 son nombres, el resto son apellidos
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
      // Separar apellidos en paterno y materno (si hay dos palabras)
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

      toast.info('Creando tu cuenta...', 2000, 'Registro')
      const response = await registerUser(userData)
      
      // El hook useAuth ya maneja la obtención del rol y la redirección
      const userName = response.user?.name || nameParts.firstName.trim()
      toast.success(`¡Cuenta creada exitosamente! Bienvenido, ${userName}`, 4000, '¡Registro exitoso!')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al registrar usuario'
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
            <h1 className={styles.title}>Crear Cuenta</h1>
            <p className={styles.subtitle}>Únete a RPsoft</p>
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
                toast.info('Conectando con Microsoft...', 2000, 'Registro')
                await handleMicrosoftRegister(undefined, 1)
              } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Error al registrar con Microsoft'
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

            <button type="submit" disabled={isLoading || authLoading} className={styles.submitButton}>
              {isLoading || authLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              ¿Ya tienes cuenta?{' '}
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
