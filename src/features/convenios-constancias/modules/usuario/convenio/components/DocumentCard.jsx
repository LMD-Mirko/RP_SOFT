import { useCallback, useRef } from 'react'
import { Check, Minus } from 'lucide-react'
import { Button } from 'antd'
import styles from './DocumentCard.module.css'

export function DocumentCard({ title, fileName, status, onUpload }) {
  const isUploaded = status === 'uploaded'
  const fileInputRef = useRef(null)
  const handleUploadClick = useCallback(() => {
    if (!isUploaded && fileInputRef.current) fileInputRef.current.click()
  }, [isUploaded])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    // reset input for reselecting same file if needed
    e.target.value = ''
  }

  return (
    <div className={isUploaded ? styles.cardSuccess : styles.cardDefault}>
      <div className={styles.iconWrapper}>
        {isUploaded ? (
          <Check size={32} className={styles.successIcon} />
        ) : (
          <Minus size={32} className={styles.defaultIcon} />
        )}
      </div>

      <div className={styles.title}>{fileName || title}</div>

      <div className={styles.actions}>
        {isUploaded ? (
          <span className={styles.uploadedLabel}>Subido Correctamente</span>
        ) : (
          <>
            <Button type="primary" size="middle" onClick={handleUploadClick}>
              Subir Archivo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
    </div>
  )
}