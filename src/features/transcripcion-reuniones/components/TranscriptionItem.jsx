import { useState } from 'react'
import { CheckSquare, Square, Download, MoreVertical, Pin } from 'lucide-react'
import styles from '../pages/TranscripcionesPage.module.css'

export function TranscriptionItem({ item, selected, onToggle, onDownload, onMore, onDelete, onRename, onPin, onUnpin, onInfo, selectedCount = 0, onBulkDelete, onBulkPin, onBulkUnpin, selectedPinnedCount = 0, onChangeType }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const sizeText = `${item.sizeKB.toFixed(1)} KB`
  return (
    <div className={styles.row}>
      <button className={styles.checkbox} aria-label={`Seleccionar ${item.name}`} onClick={onToggle}>
        {selected ? (
          <CheckSquare size={18} color="#0ea5e9" />
        ) : (
          <Square size={18} color="#9aa4b2" />
        )}
      </button>
      <div className={styles.colName} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <a href="#" className={styles.link}>{item.name}</a>
        {item.pinned && (
          <span className={styles.pinIcon}>
            <Pin size={14} />
          </span>
        )}
      </div>
      <div className={styles.colType}>
        <select
          value={item.type}
          onChange={(e) => onChangeType?.(e.target.value)}
          className={styles.typeSelect}
          aria-label={`Cambiar tipo de ${item.name}`}
        >
          <option value="audio.docx">audio.docx</option>
          <option value="audio.wav">audio.wav</option>
          <option value="audio.pdf">audio.pdf</option>
        </select>
      </div>
      <div className={styles.colSize}>{sizeText}</div>
      <div className={styles.colDate}>{item.date}</div>
      <div className={styles.actions}>
        <button title="Descargar" className={styles.iconBtn} onClick={onDownload}><Download size={16} /></button>
        <button title="Más" className={styles.iconBtn} onClick={() => setMenuOpen((v) => !v)}><MoreVertical size={16} /></button>
      </div>

      {menuOpen && (
        <div className={styles.menuPanel}>
          {selectedCount > 0 ? (
            <>
              <button className={styles.menuAction} onClick={() => { onBulkDelete?.(); setMenuOpen(false) }}>
                {`Eliminar(${selectedCount})`}
              </button>
              {selectedPinnedCount === selectedCount ? (
                <button className={styles.menuAction} onClick={() => { onBulkUnpin?.(); setMenuOpen(false) }}>
                  {`Desfijar(${selectedCount})`}
                </button>
              ) : selectedPinnedCount === 0 ? (
                <button className={styles.menuAction} onClick={() => { onBulkPin?.(); setMenuOpen(false) }}>
                  {`Fijar(${selectedCount})`}
                </button>
              ) : (
                <>
                  <button className={styles.menuAction} onClick={() => { onBulkPin?.(); setMenuOpen(false) }}>
                    {`Fijar(${selectedCount})`}
                  </button>
                  <button className={styles.menuAction} onClick={() => { onBulkUnpin?.(); setMenuOpen(false) }}>
                    {`Desfijar(${selectedCount})`}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button className={styles.menuAction} onClick={() => { onDelete?.(item); setMenuOpen(false) }}>
                Eliminar
              </button>
              <button className={styles.menuAction} onClick={() => { onRename?.(item); setMenuOpen(false) }}>
                Renombrar
              </button>
              {item.pinned ? (
                <button className={styles.menuAction} onClick={() => { onUnpin?.(item); setMenuOpen(false) }}>
                  Desfijar
                </button>
              ) : (
                <button className={styles.menuAction} onClick={() => { onPin?.(item); setMenuOpen(false) }}>
                  Fijar
                </button>
              )}
              <button className={styles.menuAction} onClick={() => { onInfo?.(item); setMenuOpen(false) }}>
                Información
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}