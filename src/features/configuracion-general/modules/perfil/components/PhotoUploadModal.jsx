import { useState, useRef } from 'react'
import { Camera, Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import styles from './PhotoUploadModal.module.css'

export function PhotoUploadModal({ isOpen, onClose, onUpload, currentPhoto, uploading }) {
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    setError(null)
    setSelectedFile(null)
    setPreview(null)

    // Validaciones
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Formato no permitido. Use JPG, PNG o WEBP')
      return
    }

    if (file.size > maxSize) {
      setError(`El archivo es muy grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo: 5MB`)
      return
    }

    setSelectedFile(file)

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  const handleClose = () => {
    setPreview(null)
    setSelectedFile(null)
    setError(null)
    setIsDragging(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const displayPhoto = preview || currentPhoto

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cambiar Foto de Perfil"
      size="md"
    >
      <div className={styles.content}>
        <div className={styles.previewSection}>
          <div className={styles.previewContainer}>
            {displayPhoto ? (
              <img src={displayPhoto} alt="Preview" className={styles.previewImage} />
            ) : (
              <div className={styles.previewPlaceholder}>
                <ImageIcon size={64} />
                <p>Vista previa</p>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleInputChange}
            className={styles.fileInput}
            id="photoFileInput"
            disabled={uploading}
          />
          <label htmlFor="photoFileInput" className={styles.dropZoneLabel}>
            <div className={styles.dropZoneIcon}>
              {isDragging ? <Upload size={48} /> : <Camera size={48} />}
            </div>
            <p className={styles.dropZoneText}>
              {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
            </p>
            <p className={styles.dropZoneHint}>
              Formatos: JPG, PNG, WEBP • Máximo: 5MB
            </p>
          </label>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            icon={Upload}
          >
            {uploading ? 'Subiendo...' : 'Subir Foto'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

