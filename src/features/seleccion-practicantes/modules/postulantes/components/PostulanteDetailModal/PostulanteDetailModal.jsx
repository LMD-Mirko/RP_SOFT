import { User, Mail, Calendar, FileText, CheckCircle, Clock, AlertCircle, Phone, MapPin, CreditCard, Cake } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import styles from './PostulanteDetailModal.module.css'
import clsx from 'clsx'

export function PostulanteDetailModal({ isOpen, onClose, postulante }) {
  if (!postulante) return null

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Completado':
        return CheckCircle
      case 'En Progreso':
        return Clock
      case 'Pendiente':
        return AlertCircle
      default:
        return Clock
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'completed'
      case 'En Progreso':
        return 'progress'
      case 'Pendiente':
        return 'pending'
      default:
        return 'progress'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const calculateAge = (dateString) => {
    if (!dateString) return null
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const EstadoIcon = getEstadoIcon(postulante.estado)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Postulante"
      size="md"
    >
      <div className={styles.content}>
        {/* Header con Avatar */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            <User size={28} />
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.nombre}>{postulante.nombre}</h3>
            <p className={styles.correo}>{postulante.correo}</p>
          </div>
        </div>

        {/* Información Personal */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información Personal</h4>
          <div className={styles.detailsGrid}>
            <div className={styles.detailRow}>
              <CreditCard size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>DNI</span>
                <p className={styles.detailValue}>{postulante.dni || 'No especificado'}</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <Cake size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Fecha de Nacimiento</span>
                <p className={styles.detailValue}>
                  {postulante.fechaNacimiento
                    ? `${formatDate(postulante.fechaNacimiento)} (${calculateAge(postulante.fechaNacimiento)} años)`
                    : 'No especificada'}
                </p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <Phone size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Teléfono</span>
                <p className={styles.detailValue}>{postulante.telefono || 'No especificado'}</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <MapPin size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Dirección</span>
                <p className={styles.detailValue}>{postulante.direccion || 'No especificada'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información de Contacto</h4>
          <div className={styles.detailRow}>
            <Mail size={16} className={styles.detailIcon} />
            <div>
              <span className={styles.detailLabel}>Correo Electrónico</span>
              <p className={styles.detailValue}>{postulante.correo}</p>
            </div>
          </div>
        </div>

        {/* Información de Proceso (Compacta) */}
        <div className={styles.processSection}>
          <div className={styles.processItem}>
            <FileText size={16} className={styles.processIcon} />
            <div className={styles.processContent}>
              <span className={styles.processLabel}>Etapa</span>
              <span className={styles.badgeEtapa}>{postulante.etapa}</span>
            </div>
          </div>

          <div className={styles.processItem}>
            <EstadoIcon size={16} className={clsx(styles.processIcon, styles[`icon_${getEstadoColor(postulante.estado)}`])} />
            <div className={styles.processContent}>
              <span className={styles.processLabel}>Estado</span>
              <span className={clsx(styles.badgeEstado, styles[`badge_${getEstadoColor(postulante.estado)}`])}>
                {postulante.estado}
              </span>
            </div>
          </div>

          <div className={styles.processItem}>
            <Calendar size={16} className={styles.processIcon} />
            <div className={styles.processContent}>
              <span className={styles.processLabel}>Fecha de Registro</span>
              <span className={styles.fecha}>{formatDate(postulante.fecha)}</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.closeButton}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}

