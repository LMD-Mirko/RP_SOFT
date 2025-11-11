import { useState } from 'react'
import { X, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import styles from './QRGeneratorModal.module.css'

export function QRGeneratorModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)

  if (!isOpen) return null

  const handleGenerate = () => {
    if (url.trim()) {
      setQrGenerated(true)
    }
  }

  const handleClose = () => {
    setUrl('')
    setQrGenerated(false)
    onClose()
  }

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg')
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
        link.download = 'qr-code.png'
        link.click()
        URL.revokeObjectURL(url)
      })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>

        <h2 className={styles.title}>INGRESA URL</h2>

        <input
          type="text"
          className={styles.input}
          placeholder="Ingresa un URL para generar un QR"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && url.trim()) {
              handleGenerate()
            }
          }}
        />

        <div className={styles.content}>
          <button 
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={!url.trim()}
          >
            GENERAR
          </button>

          <div className={styles.qrContainer}>
            {qrGenerated ? (
              <div className={styles.qrPlaceholder}>
                <QRCodeSVG
                  id="qr-code-svg"
                  value={url}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
            ) : (
              <div className={styles.qrPlaceholder}>
                <span className={styles.emptyText}>El código QR aparecerá aquí</span>
              </div>
            )}
          </div>
        </div>

        {qrGenerated && (
          <button 
            className={styles.downloadButton}
            onClick={handleDownload}
          >
            <Download size={20} />
            Descargar QR
          </button>
        )}
      </div>
    </div>
  )
}
