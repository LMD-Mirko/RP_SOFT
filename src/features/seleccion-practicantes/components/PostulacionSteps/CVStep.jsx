import { useState, useRef } from 'react'
import { Button } from '@shared/components/Button'
import { Upload, FileText, X } from 'lucide-react'
import styles from './StepForm.module.css'

export function CVStep({ data, onNext, onBack }) {
  const [cvFile, setCvFile] = useState(data.cvFile || null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar que sea PDF y menor a 5MB
      if (file.type !== 'application/pdf') {
        setError('Solo se permiten archivos PDF')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo debe ser menor a 5MB')
        return
      }
      setCvFile(file)
      setError('')
    }
  }

  const handleRemoveFile = () => {
    setCvFile(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Solo se permiten archivos PDF')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo debe ser menor a 5MB')
        return
      }
      setCvFile(file)
      setError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!cvFile) {
      setError('Debes subir tu CV para continuar')
      return
    }
    onNext({ cvFile })
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepCard}>
        <div className={styles.stepHeader}>
          <h2 className={styles.stepTitle}>Subir Curriculum vital</h2>
          <p className={styles.stepSubtitle}>Carga tu CV en formato PDF (máximo 5 MB)</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.uploadSection}>
            {!cvFile ? (
              <div
                className={styles.dropzone}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} className={styles.uploadIcon} />
                <p className={styles.dropzoneText}>
                  Arraztra tu CV aquí o haz clic
                </p>
                <p className={styles.dropzoneSubtext}>
                  Formato PDF (máximo 5 MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
              </div>
            ) : (
              <div className={styles.filePreview}>
                <div className={styles.fileInfo}>
                  <FileText size={40} className={styles.fileIcon} />
                  <div className={styles.fileDetails}>
                    <p className={styles.fileName}>{cvFile.name}</p>
                    <p className={styles.fileSize}>{formatFileSize(cvFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className={styles.removeButton}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            {error && <span className={styles.errorText}>{error}</span>}
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className={styles.buttonSecondary}
            >
              Atrás
            </Button>
            <Button
              type="submit"
              variant="primary"
              className={styles.buttonPrimary}
            >
              Siguiente
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}