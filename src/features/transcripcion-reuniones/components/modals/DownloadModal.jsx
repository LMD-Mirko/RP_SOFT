import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import { Download } from 'lucide-react'

export function DownloadModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Descarga" size="md" rounded={false}>
      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{ color: '#6b7280' }}>¿Estás seguro de que deseas descargar este archivo?</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <Button size="lg" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button size="lg" variant="primary" icon={Download} onClick={onConfirm}>Descargar</Button>
        </div>
      </div>
    </Modal>
  )
}