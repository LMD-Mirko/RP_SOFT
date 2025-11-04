import { useState } from 'react'
import { X, User, Check } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import styles from './ParticipantsModal.module.css'
import clsx from 'clsx'

// Datos mock de participantes
const mockParticipants = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juan.perez@senati.pe' },
  { id: 2, nombre: 'María García', correo: 'maria.garcia@senati.pe' },
  { id: 3, nombre: 'Carlos López', correo: 'carlos.lopez@senati.pe' },
  { id: 4, nombre: 'Ana Ramírez', correo: 'ana.ramirez@senati.pe' },
  { id: 5, nombre: 'Pedro Sánchez', correo: 'pedro.sanchez@senati.pe' },
  { id: 6, nombre: 'Laura Martínez', correo: 'laura.martinez@senati.pe' },
]

export function ParticipantsModal({ isOpen, onClose, selectedParticipants = [], onConfirm }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState(selectedParticipants)

  const filteredParticipants = mockParticipants.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.correo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggle = (participantId) => {
    setSelected((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    )
  }

  const handleConfirm = () => {
    const selectedData = mockParticipants.filter((p) => selected.includes(p.id))
    onConfirm(selectedData)
    onClose()
  }

  const handleSelectAll = () => {
    if (selected.length === filteredParticipants.length) {
      setSelected([])
    } else {
      setSelected(filteredParticipants.map((p) => p.id))
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar Participantes"
      size="md"
    >
      <div className={styles.content}>
        <Input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.selectAll}>
          <button
            type="button"
            onClick={handleSelectAll}
            className={styles.selectAllButton}
          >
            {selected.length === filteredParticipants.length && filteredParticipants.length > 0
              ? 'Deseleccionar todos'
              : 'Seleccionar todos'}
          </button>
          <span className={styles.selectedCount}>
            {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className={styles.participantsList}>
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => {
              const isSelected = selected.includes(participant.id)
              return (
                <div
                  key={participant.id}
                  className={clsx(
                    styles.participantItem,
                    isSelected && styles.selected
                  )}
                  onClick={() => handleToggle(participant.id)}
                >
                  <div className={styles.participantInfo}>
                    <div className={styles.avatar}>
                      <User size={20} />
                    </div>
                    <div>
                      <p className={styles.participantName}>{participant.nombre}</p>
                      <p className={styles.participantEmail}>{participant.correo}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className={styles.checkIcon}>
                      <Check size={18} />
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className={styles.emptyState}>
              <p>No se encontraron participantes</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            fullWidth
          >
            Confirmar ({selected.length})
          </Button>
        </div>
      </div>
    </Modal>
  )
}

