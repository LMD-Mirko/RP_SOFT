import { Download, Eye, Printer, Trash2 } from 'lucide-react'
import { Button } from '@shared/components/Button'
import styles from './DocumentActions.module.css'

export function DocumentActions({ onDownload, onViewFull, onPrint, onDelete, hasSelection }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Acciones</h2>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={onDownload}
          disabled={!hasSelection}
          fullWidth
          icon={Download}
          iconPosition="left"
          className={styles.downloadButton}
        >
          Descargar
        </Button>

        <Button
          variant="primary"
          onClick={onViewFull}
          disabled={!hasSelection}
          fullWidth
          icon={Eye}
          iconPosition="left"
          className={styles.viewButton}
        >
          Ver Completo
        </Button>

        <Button
          variant="secondary"
          onClick={onPrint}
          disabled={!hasSelection}
          fullWidth
          icon={Printer}
          iconPosition="left"
          className={styles.printButton}
        >
          Imprimir
        </Button>

        {onDelete && (
          <Button
            variant="danger"
            onClick={onDelete}
            disabled={!hasSelection}
            fullWidth
            icon={Trash2}
            iconPosition="left"
            className={styles.deleteButton}
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  )
}

