import { X, Upload, File, CheckCircle2, AlertCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/ImportModal.module.css'
import { Button } from './ui/Button'

export function ImportModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setFile(null)
      setStatus(null)
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer?.files?.[0]
    if (f) {
      setFile(f)
      setStatus(null)
    }
  }

  const handleImport = () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Selecciona un archivo primero.' })
      return
    }
    try {
      onImport && onImport(file)
      setStatus({ type: 'success', message: `Archivo listo: ${file.name}` })
    } catch (err) {
      setStatus({ type: 'error', message: 'Ocurrió un error al preparar la importación.' })
    }
  }

  return (
    <div className={styles.overlay} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Upload size={18} />
            <h3 className={styles.title}>Importar Plantillas</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>
          <div
            className={styles.dropZone}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
          >
            <Upload size={24} />
            <span>Arrastra y suelta tu archivo aquí</span>
            <span className={styles.hint}>o haz clic para seleccionar</span>
            <input
              ref={inputRef}
              type="file"
              className={styles.fileInput}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) { setFile(f); setStatus(null) }
              }}
            />
          </div>

          {file && (
            <div className={styles.fileInfo}>
              <File size={18} />
              <span className={styles.fileName}>{file.name}</span>
            </div>
          )}

          {status?.type === 'success' && (
            <div className={`${styles.alert} ${styles.success}`}>
              <CheckCircle2 size={18} />
              <span>{status.message}</span>
            </div>
          )}
          {status?.type === 'error' && (
            <div className={`${styles.alert} ${styles.error}`}>
              <AlertCircle size={18} />
              <span>{status.message}</span>
            </div>
          )}

          <div className={styles.actions}>
            <Button variant="light" onClick={onClose}>Cancelar</Button>
            <Button variant="dark" onClick={handleImport}>Preparar Importación</Button>
          </div>
        </div>
      </div>
    </div>
  )
}