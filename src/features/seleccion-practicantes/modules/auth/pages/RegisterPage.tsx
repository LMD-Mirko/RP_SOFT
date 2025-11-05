import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import styles from "./RegisterPage.module.css"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un email válido")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      localStorage.setItem(
        "rpsoft_user",
        JSON.stringify({
          email,
          loginTime: new Date().toISOString(),
        }),
      )

      localStorage.removeItem("rpsoft_selection_data")
      localStorage.removeItem("rpsoft_current_step")

      navigate("/seleccion-practicantes")
      setIsLoading(false)
    }, 500)
  }

  const handleGoogleRegister = () => {
    console.log("Registrarse con Google")
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

          {error && (
            <div className={styles.errorAlert}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleRegister}
            className={styles.googleButton}
          >
            <svg className={styles.googleIcon} viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Registrarse con Google
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

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/seleccion-practicantes/auth/login" className={styles.link}>
                Iniciar sesión
              </Link>
            </p>
          </div>

          <p className={styles.disclaimer}>
            Plataforma segura de selección de practicantes SENATI
          </p>
        </div>
      </div>
    </div>
  )
}
