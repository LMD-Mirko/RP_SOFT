import { useEffect, useState } from 'react'
import { Button } from 'antd'
import styles from './ConvenioActivo.module.css'
import { useNavigate } from 'react-router-dom'

export function ConvenioActivo() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('convenioDocs')
    if (saved) setDocs(JSON.parse(saved))
    else navigate('/convenios-constancias/usuario/convenio/carga-documentos')
  }, [navigate])

  const handleDownloadZip = () => {
    // Mock: genera un archivo de texto con los nombres
    const names = Object.values(docs || {}).map((d) => `- ${d.fileName || 'sin-archivo'}`).join('\n')
    const blob = new Blob([`Documentos Firmados\n${names}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'documentos_firmados.zip.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGoToConstancia = () => {
    localStorage.setItem('convenioStage', 'constancia')
    navigate('/convenios-constancias/usuario/constancias')
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Convenios de Prácticas</h1>
        <p className={styles.subtitle}>Carga los 3 documentos requeridos en formato PDF</p>
      </header>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Convenio Activo</h2>
        <p className={styles.cardSubtitle}>Documentos aprobados y firmados</p>

        <div className={styles.statsGrid}>
          <div className={styles.stat}><div className={styles.statLabel}>FECHA DE INICIO</div><div className={styles.statValue}>30/10/2025</div></div>
          <div className={styles.stat}><div className={styles.statLabel}>FECHA DE FINALIZACION</div><div className={styles.statValue}>30/04/2026</div></div>
          <div className={styles.stat}><div className={styles.statLabel}>ESTUDIANTE</div><div className={styles.statValue}>Carlos Vivez Sanchez</div></div>
        </div>

        <div className={styles.documentsCard}>
          <h3 className={styles.docsTitle}>Documentos Firmados</h3>
          <p className={styles.docsSubtitle}>Descarga todos los documentos firmados digitalmente en un archivo ZIP</p>
          <ul className={styles.fileList}>
            {Object.values(docs || {}).map((d, idx) => (
              <li key={idx} className={styles.fileItem}>{d.fileName || 'Documento.pdf'}</li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Button type="primary" onClick={handleDownloadZip}>Descargar todo (.Zip)</Button>
            <Button style={{ marginLeft: 12 }} onClick={handleGoToConstancia}>Ir a Constancia</Button>
          </div>
        </div>
      </div>
    </section>
  )
}