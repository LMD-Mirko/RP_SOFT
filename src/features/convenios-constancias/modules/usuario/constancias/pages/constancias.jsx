import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import styles from './constancias.module.css'

export function UsuarioConstancias() {
  const [stage, setStage] = useState('idle')

  useEffect(() => {
    const s = localStorage.getItem('convenioStage')
    if (s === 'constancia') setStage('constancia')
    else setStage('idle')
  }, [])

  if (stage !== 'constancia') {
    return (
      <section className="p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Constancias</h1>
          <p className="text-gray-500 text-sm">Gestión de constancias de usuarios</p>
        </header>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">
            Aquí se mostrará el listado y flujo de trabajo de constancias para usuarios.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Constancias</h1>
        <p className={styles.subtitle}>Generación de constancias laborales</p>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardLeft}>
            <div className={styles.cardTitle}>Constancia Laboral</div>
            <div className={styles.cardMeta}>Practicante: Carlos Vivez Sanchez</div>
            <div className={styles.cardMeta}>Frontend</div>
          </div>
          <div className={styles.cardRight}>
            <CheckCircle size={20} className={styles.okIcon} />
            <span className={styles.okText}>¡Constancia de trabajo obtenida!</span>
          </div>
        </div>

        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>
        <div className={styles.cardFooter}>Fecha de entrega de Constancia de trabajo: 10 de diciembre</div>

        <div className={styles.actions}>
          <a className={styles.downloadBtn} href="#" onClick={(e) => e.preventDefault()}>Descargar Constancia</a>
        </div>
      </div>
    </section>
  )
}
