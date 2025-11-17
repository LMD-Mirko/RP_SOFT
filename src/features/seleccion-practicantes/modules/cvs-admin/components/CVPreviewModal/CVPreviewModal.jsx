import { X, Download, Loader2, AlertCircle } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { useState, useEffect, useRef } from 'react'
import * as cvsAdminService from '../../services'
import styles from './CVPreviewModal.module.css'

export function CVPreviewModal({ isOpen, onClose, cv, onDownload, previewUrl }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const blobUrlRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !cv) {
      // Limpiar blob URL al cerrar
      if (blobUrlRef.current) {
        window.URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
      setBlobUrl(null)
      setLoading(false)
      setError(null)
      return
    }

    // Cargar el PDF como blob para evitar problemas de autenticación en iframe
    const loadPDF = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Usar el servicio para obtener el PDF como blob
        const blobData = await cvsAdminService.getPDFBlob(cv.id)
        
        // blobData ya es un Blob, no necesitamos crear otro
        // Limpiar blob URL anterior si existe
        if (blobUrlRef.current) {
          window.URL.revokeObjectURL(blobUrlRef.current)
        }
        
        const url = window.URL.createObjectURL(blobData)
        blobUrlRef.current = url
        setBlobUrl(url)
        setLoading(false)
      } catch (err) {
        console.error('Error al cargar PDF:', err)
        setError('No se pudo cargar el documento PDF.')
        setLoading(false)
      }
    }

    loadPDF()

    // Limpiar blob URL al desmontar o cerrar
    return () => {
      if (blobUrlRef.current) {
        window.URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [isOpen, cv?.id, reloadKey])

  if (!isOpen || !cv) return null

  const handleReload = () => {
    setError(null)
    if (blobUrlRef.current) {
      window.URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setBlobUrl(null)
    setReloadKey(prev => prev + 1) // Forzar recarga del useEffect
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl" 
      showCloseButton={false} 
      title={null}
      className={styles.modal}
      centered
    >
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>{cv.original_filename}</h2>
            <p className={styles.subtitle}>
              {cv.user_name || cv.user_email} • {cv.postulant_info?.job_posting_title || 'N/A'}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.downloadButton}
              onClick={() => onDownload(cv)}
              title="Descargar CV"
            >
              <Download size={18} />
              Descargar
            </button>
            <button
              className={styles.closeButton}
              onClick={onClose}
              title="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className={styles.previewContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <Loader2 size={32} className={styles.spinner} />
              <p>Cargando vista previa...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <AlertCircle size={48} className={styles.errorIcon} />
              <h3 className={styles.errorTitle}>Error</h3>
              <p className={styles.errorMessage}>{error}</p>
              <button className={styles.reloadButton} onClick={handleReload}>
                Volver a cargar
              </button>
            </div>
          ) : blobUrl ? (
            <iframe
              src={`${blobUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=page-width`}
              className={styles.previewFrame}
              title="Vista previa del CV"
              onLoad={() => {
                setLoading(false)
              }}
              onError={() => {
                setError('No se pudo cargar el documento PDF.')
                setLoading(false)
              }}
            />
          ) : null}
        </div>
      </div>
    </Modal>
  )
}

