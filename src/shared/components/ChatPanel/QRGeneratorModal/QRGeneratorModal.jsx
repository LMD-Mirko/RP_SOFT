import { useState } from 'react'
import { X, Download, Plus, Trash2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import styles from './QRGeneratorModal.module.css'

export function QRGeneratorModal({ isOpen, onClose }) {
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [urlsList, setUrlsList] = useState([])
  const [generatedQRs, setGeneratedQRs] = useState([])
  const [error, setError] = useState('')

  if (!isOpen) return null

  const validateUrl = (urlToValidate) => {
    const trimmedUrl = urlToValidate.trim()
    if (!trimmedUrl.startsWith('https://')) {
      return 'La URL debe comenzar con https://'
    }
    try {
      new URL(trimmedUrl)
      return null
    } catch {
      return 'La URL no es válida'
    }
  }

  const handleAddUrl = () => {
    const urlError = validateUrl(url)
    if (urlError) {
      setError(urlError)
      return
    }

    if (label.trim() && url.trim()) {
      setError('')
      const newUrl = {
        id: Date.now(),
        label: label.trim(),
        url: url.trim()
      }
      setUrlsList([...urlsList, newUrl])
      setLabel('')
      setUrl('')
    }
  }

  const handleDeleteUrl = (id) => {
    setUrlsList(urlsList.filter(item => item.id !== id))
    setGeneratedQRs(generatedQRs.filter(item => item.id !== id))
  }

  const handleGenerate = () => {
    let qrsToGenerate = []
    
    // Si hay etiqueta y URL en los campos, validar y generar ese QR individual
    if (label.trim() && url.trim()) {
      const urlError = validateUrl(url)
      if (urlError) {
        setError(urlError)
        return
      }
      setError('')
      const singleQR = {
        id: Date.now(),
        label: label.trim(),
        url: url.trim()
      }
      qrsToGenerate = [singleQR]
    } else if (urlsList.length > 0) {
      // Si hay URLs en la lista, generar todos
      qrsToGenerate = urlsList.map(item => ({
        id: item.id,
        label: item.label,
        url: item.url
      }))
    } else {
      setError('Debe agregar al menos una URL o ingresar etiqueta y URL')
      return
    }
    
    setError('')
    setGeneratedQRs(qrsToGenerate)
  }

  const handleClear = () => {
    setLabel('')
    setUrl('')
    setUrlsList([])
    setGeneratedQRs([])
    setError('')
  }

  const handleClose = () => {
    setLabel('')
    setUrl('')
    setUrlsList([])
    setGeneratedQRs([])
    setError('')
    onClose()
  }

  const handleDownload = (qrId, qrLabel) => {
    const svg = document.getElementById(`qr-code-svg-${qrId}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    canvas.width = 256
    canvas.height = 256

    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `qr-${qrLabel.replace(/[^a-z0-9]/gi, '-')}.png`
        link.click()
        URL.revokeObjectURL(url)
      })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && label.trim() && url.trim()) {
      handleAddUrl()
    }
  }

  const handleUrlChange = (e) => {
    setUrl(e.target.value)
    if (error) {
      setError('')
    }
  }

  const canGenerate = () => {
    return (label.trim() && url.trim()) || urlsList.length > 0
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.title}>GENERADOR DE QR</h2>
          <p className={styles.titleSubtext}>Crea códigos QR profesionales de forma rápida y sencilla</p>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.formContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Etiqueta (ej: carlos)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            placeholder="URL (debe comenzar con https://)"
            value={url}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
          />
          <button 
            className={styles.addButton}
            onClick={handleAddUrl}
            disabled={!label.trim() || !url.trim()}
          >
            <Plus size={20} />
            Agregar
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {urlsList.length > 0 && (
          <div className={styles.urlsListContainer}>
            <div className={styles.urlsListHeader}>
              <span className={styles.urlsCount}>URLs registradas: {urlsList.length}</span>
            </div>
            <div className={styles.urlsList}>
              {urlsList.map((item) => (
                <div key={item.id} className={styles.urlItem}>
                  <div className={styles.urlInfo}>
                    <span className={styles.urlLabel}>{item.label}</span>
                    <span className={styles.urlText}>{item.url}</span>
                  </div>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteUrl(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.buttonsContainer}>
          <button 
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={!canGenerate()}
          >
            GENERAR QR
          </button>
          <button 
            className={styles.clearButton}
            onClick={handleClear}
          >
            Limpiar
          </button>
        </div>

        {generatedQRs.length > 0 && (
          <div className={styles.qrsGrid}>
            {generatedQRs.map((qr) => (
              <div key={qr.id} className={styles.qrCard}>
                <div className={styles.qrPlaceholder}>
                  <QRCodeSVG
                    id={`qr-code-svg-${qr.id}`}
                    value={qr.url}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className={styles.qrLabel}>{qr.label}</div>
                <button 
                  className={styles.downloadButtonSmall}
                  onClick={() => handleDownload(qr.id, qr.label)}
                >
                  <Download size={16} />
                  Descargar
                </button>
              </div>
            ))}
          </div>
        )}

        {generatedQRs.length === 0 && urlsList.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyText}>Los códigos QR aparecerán aquí</span>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
