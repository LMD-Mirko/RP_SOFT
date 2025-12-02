import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import styles from '../login/LoginPage.module.css'
import { handleMicrosoftRedirect } from '../../utils/microsoftOAuth'
import { oauthLogin, getUserRole } from '../../services/auth.service'
import { setAuthTokens } from '../../../../shared/utils/cookieHelper'
import { redirectByRole } from '../../utils/redirectByRole'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processCallback = async () => {
      try {
        toast.info('Procesando autenticación con Microsoft...', 2000, 'Autenticación')
        const microsoftData = await handleMicrosoftRedirect()

        if (!microsoftData) {
          toast.warning('No se pudo obtener la información de Microsoft', 3000, 'Autenticación cancelada')
          navigate('/')
          return
        }

        // Validar que todos los campos requeridos estén presentes
        if (!microsoftData.provider || !microsoftData.provider_id || !microsoftData.email) {
          const missingFields = []
          if (!microsoftData.provider) missingFields.push('provider')
          if (!microsoftData.provider_id) missingFields.push('provider_id')
          if (!microsoftData.email) missingFields.push('email')
          toast.error(`Faltan campos requeridos: ${missingFields.join(', ')}`, 4000, 'Error de autenticación')
          navigate('/')
          return
        }

        // Obtener role_id de sessionStorage si existe (guardado antes de redirigir a OAuth)
        // Si no existe, usar 1 por defecto (postulante)
        const roleId = parseInt(sessionStorage.getItem('oauth_role_id') || '1', 10)
        
        const response = await oauthLogin({
          provider: microsoftData.provider,
          provider_id: microsoftData.provider_id,
          email: microsoftData.email,
          name: microsoftData.name || '',
          paternal_lastname: microsoftData.paternal_lastname || '',
          maternal_lastname: microsoftData.maternal_lastname || '',
          role_id: roleId,
        })
        
        // Limpiar el role_id de sessionStorage después de usarlo
        sessionStorage.removeItem('oauth_role_id')

        // Limpiar marca de logout si existe
        sessionStorage.removeItem('rpsoft_logging_out')
        
        // Guardar tokens en cookies
        if (response.tokens) {
          const accessToken = response.tokens.access
          const refreshToken = response.tokens.refresh
          if (accessToken) {
            setAuthTokens(accessToken, refreshToken)
          }
        } else if (response.token) {
          // Compatibilidad con formato anterior
          setAuthTokens(response.token, '')
        }

        if (response.user) {
          localStorage.setItem(
            'rpsoft_user',
            JSON.stringify({
              email: response.user.email || microsoftData.email,
              name: response.user.name || microsoftData.name,
              role: response.user.role || 'practicante',
              loginTime: new Date().toISOString(),
              provider: 'microsoft',
            }),
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
          
          setStatus('success')
          const userName = response.user?.name || microsoftData.name || microsoftData.email
          toast.success(`¡Bienvenido, ${userName}! Autenticación exitosa`, 3000, 'Autenticación exitosa')

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
              
              setStatus('success')
              const userName = microsoftData.name || microsoftData.email
              toast.success(`¡Bienvenido, ${userName}! Autenticación exitosa`, 3000, 'Autenticación exitosa')
              
              setTimeout(() => {
                redirectByRole(updatedUserData, navigate)
              }, 1000)
            } else {
              setStatus('success')
              const userName = microsoftData.name || microsoftData.email
              toast.success(`¡Bienvenido, ${userName}! Autenticación exitosa`, 3000, 'Autenticación exitosa')
              
              setTimeout(() => {
                navigate('/dashboard')
              }, 1000)
            }
          } catch (roleError) {
            setStatus('success')
            const userName = microsoftData.name || microsoftData.email
            toast.success(`¡Bienvenido, ${userName}! Autenticación exitosa`, 3000, 'Autenticación exitosa')
            
            setTimeout(() => {
              navigate('/dashboard')
            }, 1000)
          }
        }

        localStorage.removeItem('rpsoft_selection_data')
        localStorage.removeItem('rpsoft_current_step')
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al procesar la autenticación con Microsoft'
        setError(message)
        setStatus('error')
        toast.error(message, 4000, 'Error de autenticación')

        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
    }

    void processCallback()
  }, [navigate])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoText}>RP</span>
            </div>
            <h1 className={styles.title}>Procesando autenticación...</h1>
          </div>

          {status === 'loading' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Completando el inicio de sesión con Microsoft...</p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#10b981' }}>✓ Autenticación exitosa</p>
              <p>Redirigiendo...</p>
            </div>
          )}

          {status === 'error' && error && (
            <div className={styles.errorAlert}>
              <p className={styles.errorText}>{error}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                Serás redirigido al login en unos segundos...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
