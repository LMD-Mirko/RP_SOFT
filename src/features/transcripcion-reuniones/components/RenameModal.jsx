import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import styles from './RenameModal.module.css'

export function RenameModal({ isOpen, onClose, name = '', onConfirm }) {
  const [newName, setNewName] = useState(name)

  useEffect(() => setNewName(name), [name])

  const handleConfirm = () => {
    onConfirm?.(newName)
    onClose?.()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Renombrar" size="md" rounded={false}>
      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{ fontWeight: 600, color: '#374151' }}>Nombre de archivo:</div>
        <input
          value={name}
          readOnly
          style={{
            border: '1px solid #e5e7eb',
            background: '#fff',
            borderRadius: 10,
            height: 44,
            padding: '0 12px',
            color: '#6b7280',
          }}
        />

        <div style={{ fontWeight: 600, color: '#374151' }}>Nuevo nombre del archivo:</div>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ingresa un nuevo nombre del archivo..."
          style={{
            border: '1px solid #e5e7eb',
            background: '#fff',
            borderRadius: 10,
            height: 44,
            padding: '0 12px',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px', gap: 12, marginTop: 8 }}>
          <Button size="lg" variant="danger" className={styles.accentRed} onClick={onClose}>Cancelar</Button>
          <Button size="lg" className={styles.accentBlue} onClick={handleConfirm}>Guardar</Button>
        </div>
      </div>
    </Modal>
  )
}