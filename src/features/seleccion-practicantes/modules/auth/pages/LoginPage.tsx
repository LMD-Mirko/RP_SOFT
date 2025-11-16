import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import styles from "./LoginPage.module.css"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
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

    let role = "practicante"
    if (email.toLowerCase() === "admin@rpsoft.com") {
      role = "admin"
    }

    setTimeout(() => {
      localStorage.setItem(
        "rpsoft_user",
        JSON.stringify({
          email,
          role,
          loginTime: new Date().toISOString(),
        }),
      )

      localStorage.removeItem("rpsoft_selection_data")
      localStorage.removeItem("rpsoft_current_step")

      if (role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/seleccion-practicantes")
      }
      setIsLoading(false)
    }, 500)
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

          {error && (
            <div className={styles.errorAlert}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

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

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              ¿No tienes cuenta?{" "}
              <Link to="/seleccion-practicantes/auth/register" className={styles.link}>
                Crear cuenta
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
