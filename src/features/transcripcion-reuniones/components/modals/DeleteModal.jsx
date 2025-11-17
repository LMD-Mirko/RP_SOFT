import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import styles from './DeleteModal.module.css'

export function DeleteModal({ isOpen, onClose, onConfirm, item }) {
  const handleConfirm = () => {
    onConfirm?.(item)
    onClose?.()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      showCloseButton={false}
      size="sm"
      centered
    >
      <div style={{ display: 'grid', gap: 16 }}>
        {/* Etiqueta superior "Eliminar" */}
        <div
          style={{
            alignSelf: 'start',
            background: '#e5e7eb',
            color: '#5f6d4f',
            fontWeight: 700,
            borderRadius: 6,
            padding: '6px 16px',
          }}
        >
          Eliminar
        </div>

        {/* Contenido centrado */}
        <div style={{ textAlign: 'center', display: 'grid', gap: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>¿Eliminar archivo?</div>
          <div style={{ color: '#6b7280' }}>¿Desea eliminar este archivo de la lista?</div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px', gap: 12, marginTop: 8 }}>
          <Button
            size="lg"
            className={styles.accentBlue}
            onClick={onClose}
          >
            Salvar
          </Button>
          <Button size="lg" variant="danger" className={styles.accentRed} onClick={handleConfirm}>Eliminar</Button>
        </div>
      </div>
    </Modal>
  )
}