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
      <div className={styles.container}>
        <div className={styles.label}>Nombre de archivo:</div>
        <input
          value={name}
          readOnly
          className={styles.input}
        />

        <div className={styles.label}>Nuevo nombre del archivo:</div>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ingresa un nuevo nombre del archivo..."
          className={styles.input}
        />

        <div className={styles.footer}>
          <Button size="lg" variant="secondary" className={styles.animatedSecondary} onClick={onClose}>Cancelar</Button>
          <Button size="lg" variant="primary" className={styles.animatedPrimary} onClick={handleConfirm}>Guardar</Button>
        </div>
      </div>
    </Modal>
  )
}