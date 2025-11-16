import { User, Mail, Calendar, FileText, CheckCircle, Clock, AlertCircle, Phone, MapPin, CreditCard, Cake, Download } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { generatePostulantePDF } from '../../services/postulantePDFService'
import { useToast } from '@shared/components/Toast'
import { useState } from 'react'
import styles from './PostulanteDetailModal.module.css'
import clsx from 'clsx'

export function PostulanteDetailModal({ isOpen, onClose, postulante }) {
  const toast = useToast()
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  if (!postulante) return null

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true)
      await generatePostulantePDF(postulante)
      toast.success('PDF generado exitosamente')
    } catch (error) {
      console.error('Error al generar PDF:', error)
      toast.error('Error al generar el PDF. Por favor, intente nuevamente.')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const getEstadoIcon = (userPostulantStatus, estado, accepted) => {
    // Usar SOLO user_postulant_status como fuente de verdad
    // 1 = No aplicado, 2 = En proceso, 3 = Aceptado, 4 = Rechazado
    if (userPostulantStatus === 3) {
      return CheckCircle
    }
    if (userPostulantStatus === 4) {
      return AlertCircle
    }
    if (userPostulantStatus === 2) {
      return Clock
    }
    if (userPostulantStatus === 1) {
      return Clock
    }
    // Fallback solo si userPostulantStatus no está disponible
    if (estado === 'Aceptado' || accepted === true) {
      return CheckCircle
    }
    if (estado === 'Rechazado' || accepted === false) {
      return AlertCircle
    }
    return Clock
  }

  const getEstadoColor = (userPostulantStatus, estado, accepted) => {
    // Usar SOLO user_postulant_status como fuente de verdad
    // 1 = No aplicado, 2 = En proceso, 3 = Aceptado, 4 = Rechazado
    if (userPostulantStatus === 3) {
      return 'completed'
    }
    if (userPostulantStatus === 4) {
      return 'pending'
    }
    if (userPostulantStatus === 2) {
      return 'en_proceso'
    }
    if (userPostulantStatus === 1) {
      return 'no_aplicado'
    }
    // Fallback solo si userPostulantStatus no está disponible
    if (estado === 'Aceptado' || accepted === true) {
      return 'completed'
    }
    if (estado === 'Rechazado' || accepted === false) {
      return 'pending'
    }
    return 'no_aplicado'
  }

  // Determinar estado final basado en user_postulant_status (prioritario)
  // 1 = No aplicado, 2 = En proceso, 3 = Aceptado, 4 = Rechazado
  let estadoFinal = 'Pendiente'
  if (postulante.userPostulantStatus === 3) {
    estadoFinal = 'Aceptado'
  } else if (postulante.userPostulantStatus === 4) {
    estadoFinal = 'Rechazado'
  } else if (postulante.userPostulantStatus === 2) {
    estadoFinal = 'En proceso'
  } else if (postulante.userPostulantStatus === 1) {
    estadoFinal = 'No aplicado'
  } else {
    // Fallback solo si userPostulantStatus no está disponible
    estadoFinal = postulante.accepted === true ? 'Aceptado' : 
                  postulante.accepted === false ? 'Rechazado' : 
                  postulante.estado || 'Pendiente'
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

  const EstadoIcon = getEstadoIcon(postulante.userPostulantStatus, estadoFinal, postulante.accepted)

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
            {postulante.photoUrl ? (
              <img src={postulante.photoUrl} alt={postulante.nombre} className={styles.avatarImage} />
            ) : (
              <User size={28} />
            )}
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.nombre}>{postulante.nombre}</h3>
            <p className={styles.correo}>{postulante.correo}</p>
            {postulante.username && (
              <p className={styles.username}>@{postulante.username}</p>
            )}
          </div>
        </div>

        {/* Información Personal */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información Personal</h4>
          <div className={styles.detailsGrid}>
            <div className={styles.detailRow}>
              <CreditCard size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>
                  {postulante.documentType || 'Documento'}
                </span>
                <p className={styles.detailValue}>{postulante.dni || 'No especificado'}</p>
              </div>
            </div>

            {postulante.sex && (
              <div className={styles.detailRow}>
                <User size={16} className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Sexo</span>
                  <p className={styles.detailValue}>{postulante.sex === 'M' ? 'Masculino' : postulante.sex === 'F' ? 'Femenino' : postulante.sex}</p>
                </div>
              </div>
            )}

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
                <span className={styles.detailLabel}>Ubicación</span>
                <p className={styles.detailValue}>
                  {[
                    postulante.district,
                    postulante.province,
                    postulante.region,
                    postulante.country
                  ].filter(Boolean).join(', ') || postulante.direccion || 'No especificada'}
                </p>
              </div>
            </div>

            {postulante.direccion && (
              <div className={styles.detailRow}>
                <MapPin size={16} className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Dirección</span>
                  <p className={styles.detailValue}>{postulante.direccion}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información Académica */}
        {(postulante.specialty || postulante.career || postulante.semester || postulante.experienceLevel) && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Información Académica</h4>
            <div className={styles.detailsGrid}>
              {postulante.specialty && (
                <div className={styles.detailRow}>
                  <FileText size={16} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Especialidad</span>
                    <p className={styles.detailValue}>{postulante.specialty.name || postulante.specialty}</p>
                  </div>
                </div>
              )}
              {postulante.career && (
                <div className={styles.detailRow}>
                  <FileText size={16} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Carrera</span>
                    <p className={styles.detailValue}>{postulante.career}</p>
                  </div>
                </div>
              )}
              {postulante.semester && (
                <div className={styles.detailRow}>
                  <FileText size={16} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Semestre</span>
                    <p className={styles.detailValue}>{postulante.semester}</p>
                  </div>
                </div>
              )}
              {postulante.experienceLevel && (
                <div className={styles.detailRow}>
                  <FileText size={16} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Nivel de Experiencia</span>
                    <p className={styles.detailValue}>
                      {postulante.experienceLevel === 'principiante' ? 'Principiante' :
                       postulante.experienceLevel === 'intermedio' ? 'Intermedio' :
                       postulante.experienceLevel === 'avanzado' ? 'Avanzado' :
                       postulante.experienceLevel}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
          {postulante.telefono && (
            <div className={styles.detailRow}>
              <Phone size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Teléfono</span>
                <p className={styles.detailValue}>{postulante.telefono}</p>
              </div>
            </div>
          )}
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
            <EstadoIcon size={16} className={clsx(styles.processIcon, styles[`icon_${getEstadoColor(postulante.userPostulantStatus, estadoFinal, postulante.accepted)}`])} />
            <div className={styles.processContent}>
              <span className={styles.processLabel}>Estado</span>
              <span className={clsx(styles.badgeEstado, styles[`badge_${getEstadoColor(postulante.userPostulantStatus, estadoFinal, postulante.accepted)}`])}>
                {estadoFinal}
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

          {postulante.lastUpdate && (
            <div className={styles.processItem}>
              <Calendar size={16} className={styles.processIcon} />
              <div className={styles.processContent}>
                <span className={styles.processLabel}>Última Actualización</span>
                <span className={styles.fecha}>{formatDate(postulante.lastUpdate)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className={styles.actions}>
          <button 
            onClick={handleDownloadPDF} 
            className={styles.downloadButton}
            disabled={downloadingPDF}
          >
            <Download size={18} />
            {downloadingPDF ? 'Generando...' : 'Descargar PDF'}
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}

