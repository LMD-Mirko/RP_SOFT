import { CheckSquare, Square } from 'lucide-react'
import styles from '../pages/TranscripcionesPage.module.css'
import { TranscriptionItem } from './TranscriptionItem'

export function TranscriptionList({ items = [], selected = new Set(), onToggleAll, onToggleOne, onDelete, onRename, onPin, onUnpin, onInfo, onBulkDelete, onBulkPin, onBulkUnpin, selectedPinnedCount = 0, onChangeType, onDownload }) {
  const allSelected = selected.size === items.length && items.length > 0
  const noneSelected = selected.size === 0
  return (
    <>
      <div className={styles.tableHeader}>
        <button className={styles.checkbox} onClick={onToggleAll} aria-label="Seleccionar todo">
          {allSelected ? (
            <CheckSquare size={18} color="#0ea5e9" />
          ) : (
            <Square size={18} color={noneSelected ? '#9aa4b2' : '#f59e0b'} />
          )}
        </button>
        <div className={styles.colName}>Nombre</div>
        <div className={styles.colType}>Tipo</div>
        <div className={styles.colSize}>Tamaño</div>
        <div className={styles.colDate}>Fecha</div>
        <div className={styles.colActions}></div>
      </div>
      <div className={styles.rows}>
        {items.map((item) => (
          <TranscriptionItem
            key={item.name}
            item={item}
            selected={selected.has(item.name)}
            onToggle={() => onToggleOne(item.name)}
            onDownload={() => onDownload?.(item)}
            onMore={() => {}}
            onDelete={onDelete}
            onRename={onRename}
            onPin={onPin}
            onUnpin={onUnpin}
            onInfo={onInfo}
            selectedCount={selected.size}
            onBulkDelete={onBulkDelete}
            onBulkPin={onBulkPin}
            onBulkUnpin={onBulkUnpin}
            selectedPinnedCount={selectedPinnedCount}
            onChangeType={(type) => onChangeType?.(item.name, type)}
          />
        ))}
      </div>
    </>
  )
}