import { useState } from 'react'
import { CheckCircle2, XCircle, Eye, AlertCircle } from 'lucide-react'
import styles from './ScheduleApprovalPanel.module.css'

const pendingSchedules = [
  {
    id: 1,
    practitioner: 'Juan Pérez',
    server: 'Rpsoft',
    institution: 'SENATI',
    submittedDate: '2025-01-15',
    status: 'pending',
    imageUrl: '/horario-academico.jpg',
    blocks: [
      { day: 'Lunes', startTime: '10:00', endTime: '12:00', isRemote: false },
      { day: 'Miércoles', startTime: '10:00', endTime: '12:00', isRemote: false }
    ],
    validationIssue: 'Nombre en captura no coincide exactamente'
  },
  {
    id: 2,
    practitioner: 'María García',
    server: 'Innovacion',
    institution: 'UNI',
    submittedDate: '2025-01-16',
    status: 'pending',
    imageUrl: '/horario-universidad.jpg',
    blocks: [{ day: 'Martes', startTime: '08:00', endTime: '14:00', isRemote: true }],
    validationIssue: null
  }
]

export function ScheduleApprovalPanel() {
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)

  const handleApprove = (scheduleId) => {
    console.log('Aprobando horario:', scheduleId)
  }

  const handleReject = (scheduleId) => {
    console.log('Rechazando horario:', scheduleId, 'Razón:', rejectionReason)
    setShowRejectModal(false)
    setSelectedSchedule(null)
    setRejectionReason('')
  }

  const openEvidenceModal = (schedule) => {
    setSelectedSchedule(schedule)
    setShowEvidenceModal(true)
  }

  const openRejectModal = (schedule) => {
    setSelectedSchedule(schedule)
    setShowRejectModal(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Horarios Pendientes de Aprobación</h2>
          <p className={styles.subtitle}>Revisa y aprueba los horarios de clases con evidencia</p>
        </div>
        <span className={styles.badge}>{pendingSchedules.length} pendientes</span>
      </div>

      <div className={styles.schedulesList}>
        {pendingSchedules.map((schedule) => (
          <div key={schedule.id} className={styles.scheduleCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.practitionerName}>{schedule.practitioner}</h3>
                <p className={styles.practitionerInfo}>
                  {schedule.server} • {schedule.institution}
                </p>
                <p className={styles.submittedDate}>Enviado: {schedule.submittedDate}</p>
              </div>
              <span className={styles.statusBadge}>Pendiente</span>
            </div>

            {schedule.validationIssue && (
              <div className={styles.validationAlert}>
                <AlertCircle className={styles.alertIcon} size={16} />
                <p className={styles.alertText}>{schedule.validationIssue}</p>
              </div>
            )}

            <div className={styles.blocksSection}>
              <p className={styles.blocksTitle}>Bloques declarados:</p>
              <div className={styles.blocksList}>
                {schedule.blocks.map((block, index) => (
                  <div key={index} className={styles.blockItem}>
                    <span className={styles.blockDay}>{block.day}:</span>
                    <span className={styles.blockTime}>
                      {block.startTime} - {block.endTime}
                    </span>
                    {block.isRemote && <span className={styles.remoteBadge}>Remoto</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.cardActions}>
              <button className={styles.buttonOutline} onClick={() => openEvidenceModal(schedule)}>
                <Eye size={16} />
                Ver Evidencia
              </button>
              <button className={styles.buttonSuccess} onClick={() => handleApprove(schedule.id)}>
                <CheckCircle2 size={16} />
                Aprobar
              </button>
              <button className={styles.buttonDanger} onClick={() => openRejectModal(schedule)}>
                <XCircle size={16} />
                Rechazar
              </button>
            </div>
          </div>
        ))}

        {pendingSchedules.length === 0 && (
          <div className={styles.emptyState}>
            <CheckCircle2 className={styles.emptyIcon} size={48} />
            <p>No hay horarios pendientes de aprobación</p>
          </div>
        )}
      </div>

      {/* Evidence Modal */}
      {showEvidenceModal && selectedSchedule && (
        <div className={styles.modalOverlay} onClick={() => setShowEvidenceModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Evidencia del Horario</h3>
              <p className={styles.modalSubtitle}>Captura oficial del horario de {selectedSchedule.practitioner}</p>
            </div>
            <div className={styles.modalBody}>
              <img
                src={selectedSchedule.imageUrl}
                alt="Horario"
                className={styles.evidenceImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible'
                }}
              />
              <div className={styles.blocksInfo}>
                <p className={styles.blocksInfoTitle}>Bloques declarados:</p>
                {selectedSchedule.blocks.map((block, index) => (
                  <div key={index} className={styles.blockInfoItem}>
                    {block.day}: {block.startTime} - {block.endTime}
                    {block.isRemote && ' (Remoto)'}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.buttonOutline} onClick={() => setShowEvidenceModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedSchedule && (
        <div className={styles.modalOverlay} onClick={() => setShowRejectModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Rechazar Horario</h3>
              <p className={styles.modalSubtitle}>
                Indica el motivo del rechazo para que el practicante pueda corregirlo
              </p>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.label} htmlFor="reason">
                Motivo del rechazo
              </label>
              <textarea
                id="reason"
                className={styles.textarea}
                placeholder="Ej: La captura no es clara, el nombre no coincide, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.buttonOutline} onClick={() => setShowRejectModal(false)}>
                Cancelar
              </button>
              <button
                className={styles.buttonDangerSolid}
                onClick={() => handleReject(selectedSchedule.id)}
                disabled={!rejectionReason}
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
