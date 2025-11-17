import { useEffect, useState, useRef } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from 'antd'
import styles from './ResultadoValidacion.module.css'
import { useNavigate } from 'react-router-dom'

export function ResultadoValidacion() {
  const [docs, setDocs] = useState(null)
  const navigate = useNavigate()
  const fileInputs = { convenio: useRef(null), pea: useRef(null), carta: useRef(null) }
  const MAX_SIZE_MB = 10

  useEffect(() => {
    const saved = localStorage.getItem('convenioDocs')
    if (saved) setDocs(JSON.parse(saved))
    else navigate('/convenios-constancias/usuario/convenio/carga-documentos')
  }, [navigate])

  if (!docs) return null

  const hasErrors = Object.values(docs).some((d) => d.errors?.length)

  const reupload = (key, file) => {
    const isPdf = file.type?.includes('pdf') || file.name?.toLowerCase().endsWith('.pdf')
    const isValidSize = file.size <= MAX_SIZE_MB * 1024 * 1024
    const newDoc = {
      ...docs[key],
      fileName: isPdf && isValidSize ? file.name : docs[key].fileName,
      meta: { size: file.size, type: file.type },
    }
    // Revalidar
    const errors = []
    if (!newDoc.fileName) errors.push('No se seleccionó archivo.')
    if (newDoc.meta && newDoc.meta.size > MAX_SIZE_MB * 1024 * 1024)
      errors.push(`El archivo supera ${MAX_SIZE_MB}MB.`)
    const isPdf2 = newDoc.meta?.type?.includes('pdf') || newDoc.fileName?.toLowerCase().endsWith('.pdf')
    if (!isPdf2) errors.push('El archivo no es PDF.')
    if (key === 'pea' && newDoc.fileName?.toLowerCase().includes('error'))
      errors.push('El RUC de la empresa no coincide con nuestros registros.')

    const updated = { ...docs, [key]: { ...newDoc, errors, status: errors.length ? 'pending' : 'uploaded' } }
    setDocs(updated)
    localStorage.setItem('convenioDocs', JSON.stringify(updated))
  }

  const handleSendCorrections = () => {
    const finalDocs = Object.fromEntries(
      Object.entries(docs).map(([k, d]) => [k, { ...d, status: d.errors?.length ? 'pending' : 'uploaded' }])
    )
    const ok = Object.values(finalDocs).every((d) => d.status === 'uploaded')
    localStorage.setItem('convenioDocs', JSON.stringify(finalDocs))
    if (ok) {
      localStorage.setItem('convenioStage', 'active')
      navigate('/convenios-constancias/usuario/convenio/activo')
    }
  }

  const renderBlock = (key, label, doc) => {
    const success = !doc.errors?.length
    return (
      <div className={success ? styles.blockSuccess : styles.blockError}>
        <div className={styles.blockHeader}>
          {success ? (
            <CheckCircle size={22} className={styles.successIcon} />
          ) : (
            <XCircle size={22} className={styles.errorIcon} />
          )}
          <div className={styles.blockTitle}>{label}</div>
        </div>

        {success ? (
          <p className={styles.blockText}>Documento válido y procesado correctamente</p>
        ) : (
          <>
            <div className={styles.errorBox}>
              <strong>ERROR:</strong>{' '}
              {doc.errors.join(' ')}
            </div>
            <div className={styles.blockActions}>
              <Button
                size="middle"
                onClick={() => fileInputs[key].current?.click()}
              >
                Resubir Documento
              </Button>
              <input
                ref={fileInputs[key]}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) reupload(key, file)
                  e.target.value = ''
                }}
              />
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resultado de Validación</h1>
        <p className={styles.subtitle}>Se encontraron problemas en algunos documentos</p>
      </header>

      {renderBlock('convenio', 'Convenio de Practicas', docs.convenio)}
      {renderBlock('pea', 'Documento PEA', docs.pea)}
      {renderBlock('carta', 'Carta de Presentacion', docs.carta)}

      <div className={styles.footerActions}>
        <Button type="default" size="large" disabled={hasErrors} onClick={handleSendCorrections}>
          Enviar Correcciones
        </Button>
      </div>
    </section>
  )
}