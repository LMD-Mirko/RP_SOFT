import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/components/Button'
import styles from './ConvocatoriaCardPublic.module.css'
import clsx from 'clsx'

export function ConvocatoriaCardPublic({ convocatoria, index = 0 }) {
  const navigate = useNavigate()

  const handlePostularse = () => {
    // Verificar si el usuario está autenticado
    const user = localStorage.getItem('rpsoft_user');
    if (!user) {
      // Si no está autenticado, redirigir al login
      navigate('/?redirect=/seleccion-practicantes/postulacion?convocatoria=' + convocatoria.id);
      return;
    }
    
    // Si está autenticado, ir a la página de postulación
    navigate(`/seleccion-practicantes/postulacion?convocatoria=${convocatoria.id}`);
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
          <span className={clsx(styles.badge, styles.badgeAbierta)}>
            Abierta
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
          <span className={styles.infoLabel}>POSTULANTES</span>
          <span className={styles.infoValue}>{convocatoria.postulantes}</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          onClick={handlePostularse}
          variant="primary"
          icon={ExternalLink}
          fullWidth
        >
          Postularme
        </Button>
      </div>
    </div>
  )
}

