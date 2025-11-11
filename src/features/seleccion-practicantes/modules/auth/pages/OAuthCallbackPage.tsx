import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@shared/components/Toast'
import styles from './LoginPage.module.css'
import { handleMicrosoftRedirect } from '../utils/microsoftOAuth'
import { oauthLogin } from '../services/auth.service'
import { setAuthTokens } from '../../../shared/utils/cookieHelper'

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

        const response = await oauthLogin({
          provider: microsoftData.provider,
          provider_id: microsoftData.provider_id,
          email: microsoftData.email,
          username: microsoftData.username,
        })

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
              username: response.user.username || microsoftData.username,
              role: response.user.role || 'practicante',
              loginTime: new Date().toISOString(),
              provider: 'microsoft',
            }),
          )
        }

        localStorage.removeItem('rpsoft_selection_data')
        localStorage.removeItem('rpsoft_current_step')

        setStatus('success')
        const userName = response.user?.username || microsoftData.username || microsoftData.email
        toast.success(`¡Bienvenido, ${userName}! Autenticación exitosa`, 3000, 'Autenticación exitosa')

        const userData = response.user || JSON.parse(localStorage.getItem('rpsoft_user') || '{}')
        setTimeout(() => {
          if (userData?.role === 'admin') {
            navigate('/admin/dashboard')
          } else {
            navigate('/seleccion-practicantes')
          }
        }, 1000)
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
