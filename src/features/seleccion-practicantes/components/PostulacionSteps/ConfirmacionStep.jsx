import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import styles from './StepForm.module.css'

export function ConfirmacionStep({ data }) {
  useEffect(() => {
    // Aquí podrías hacer scroll to top o alguna animación
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className={styles.stepContainer}>
      <div className={styles.confirmationCard}>
        <div className={styles.confirmationIcon}>
          <CheckCircle size={64} />
        </div>

        <h1 className={styles.confirmationTitle}>¡Postulación Enviada!</h1>
        
        <p className={styles.confirmationText}>
          Tu postulación ha sido recibida correctamente. Pronto nos pondremos en contacto contigo.
        </p>

        <div className={styles.summaryBox}>
          <h3 className={styles.summaryTitle}>Resumen de tu postulación:</h3>
          
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Nombre:</span>
              <span className={styles.summaryValue}>
                {data.nombres} {data.apellidos}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Email:</span>
              <span className={styles.summaryValue}>
                {data.correo || `${data.nombres.toLowerCase()}@senati.pe`}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Perfil:</span>
              <span className={styles.summaryValue}>
                {data.areaInteres === 'frontend' && 'Frontend'}
                {data.areaInteres === 'backend' && 'Backend'}
                {data.areaInteres === 'ux' && 'UX/UI'}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Teléfono:</span>
              <span className={styles.summaryValue}>{data.telefono}</span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>DNI:</span>
              <span className={styles.summaryValue}>{data.dni}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}