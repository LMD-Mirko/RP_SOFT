import { Copy } from 'lucide-react'
import { useState } from 'react'
import styles from './ConvocatoriaCard.module.css'
import clsx from 'clsx'

export function ConvocatoriaCard({ convocatoria, onEdit, onViewApplicants, index = 0 }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(convocatoria.link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <div 
      className={styles.card}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{convocatoria.titulo}</h3>
          <span className={clsx(styles.badge, styles[`badge_${convocatoria.estado}`])}>
            {convocatoria.estado}
          </span>
        </div>
        <p className={styles.subtitle}>{convocatoria.descripcion}</p>
      </div>

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Info Grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>FECHA INICIO</span>
          <span className={styles.infoValue}>{convocatoria.fechaInicio}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>FECHA FIN</span>
          <span className={styles.infoValue}>{convocatoria.fechaFin}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>CUPOS</span>
          <span className={styles.infoValue}>{convocatoria.cupos}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>POSTULANTES</span>
          <span className={styles.infoValue}>{convocatoria.postulantes}</span>
        </div>
      </div>

      {/* Link Section */}
      <div className={styles.linkSection}>
        <span className={styles.linkLabel}>LINK DE POSTULACIÓN</span>
        <div className={styles.linkContainer}>
          <input
            type="text"
            value={convocatoria.link}
            readOnly
            className={styles.linkInput}
          />
          <button
            onClick={handleCopy}
            className={clsx(styles.copyButton, copied && styles.copied)}
          >
            <Copy size={18} />
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={() => onEdit(convocatoria)}
          className={styles.buttonSecondary}
        >
          Editar
        </button>
        <button
          onClick={() => onViewApplicants(convocatoria)}
          className={styles.buttonSecondary}
        >
          Ver Postulantes
        </button>
      </div>
    </div>
  )
}

