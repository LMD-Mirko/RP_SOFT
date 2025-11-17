import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { User, Check, Loader2, AlertCircle } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useUsers } from '../../../shared/hooks/useUsers'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './ParticipantsModal.module.css'
import clsx from 'clsx'

export function ParticipantsModal({ isOpen, onClose, selectedParticipants = [], onConfirm }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState(selectedParticipants)
  const { users, loading, loadUsers } = useUsers()

  // Cargar usuarios cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadUsers({ 
        is_active: true, 
        page_size: 100  // Cargar muchos usuarios para selección
      })
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mapear usuarios a formato de participantes
  const participants = useMemo(() => {
    return users.map((user) => {
      const fullName = `${user.name || ''} ${user.paternal_lastname || ''} ${user.maternal_lastname || ''}`.trim() || 'Sin nombre'
      return {
        id: user.id,
        nombre: fullName,
        correo: user.email || '',
        role_id: user.role_id,
        role: user.role_id === 2 ? 'Admin' : 'Postulante',
      }
    })
  }, [users])

  // Filtrar participantes por búsqueda
  const filteredParticipants = useMemo(() => {
    if (!searchTerm) return participants

    const searchLower = searchTerm.toLowerCase()
    return participants.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchLower) ||
        p.correo.toLowerCase().includes(searchLower)
    )
  }, [participants, searchTerm])

  const handleToggle = (participantId) => {
    setSelected((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    )
  }

  const handleConfirm = () => {
    const selectedData = participants.filter((p) => selected.includes(p.id))
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

  if (!isOpen) return null

  const modalContent = (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar Participantes"
      size="md"
      zIndex={1001}
    >
      <div className={styles.content}>
        <Input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
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
          {loading ? (
            <div className={styles.loadingState}>
              <Loader2 size={32} className={styles.spinner} />
              <p>Cargando participantes...</p>
            </div>
          ) : filteredParticipants.length > 0 ? (
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
                      <p className={styles.participantName}>
                        {participant.nombre}
                        {participant.role && (
                          <span className={styles.roleBadge}>
                            {participant.role}
                          </span>
                        )}
                      </p>
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
            <EmptyState
              iconPreset="users"
              colorPreset="blue"
              title="No se encontraron participantes"
              description={searchTerm ? "Intenta con otros términos de búsqueda" : "No hay usuarios disponibles"}
              className={styles.emptyState}
            />
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

  // Renderizar con portal y z-index más alto
  return createPortal(modalContent, document.body)
}

