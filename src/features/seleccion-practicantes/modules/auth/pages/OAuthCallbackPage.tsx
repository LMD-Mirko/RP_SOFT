import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import { handleMicrosoftRedirect } from '../utils/microsoftOAuth'
import { oauthLogin } from '../services/auth.service'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processCallback = async () => {
      try {
        const microsoftData = await handleMicrosoftRedirect()

        if (!microsoftData) {
          navigate('/seleccion-practicantes/auth/login')
          return
        }

        const response = await oauthLogin({
          provider: microsoftData.provider,
          provider_id: microsoftData.provider_id,
          email: microsoftData.email,
          username: microsoftData.username,
        })

        if (response.token) {
          localStorage.setItem('authToken', response.token)
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

        setTimeout(() => {
          navigate('/seleccion-practicantes/auth/login')
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
