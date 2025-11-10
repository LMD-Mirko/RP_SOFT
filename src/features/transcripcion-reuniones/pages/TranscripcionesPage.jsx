import { useMemo, useState } from 'react'
import styles from './TranscripcionesPage.module.css'
import { SearchBar } from '../components/SearchBar'
import { DateFilter } from '../components/DateFilter'
import { TranscriptionList } from '../components/TranscriptionList'
import { RenameModal } from '../components/RenameModal'
import { DeleteModal } from '../components/DeleteModal'
import { BulkDeleteModal } from '../components/BulkDeleteModal'
import { InfoModal } from '../components/InfoModal'
import { DownloadModal } from '../components/DownloadModal'

const MOCK_ITEMS = [
  { name: 'grabacion_20251013_110003_cdbf0914_mezclada', sizeKB: 201.6, type: 'audio.docx', date: '13 oct' },
  { name: 'grabacion_20251014_093527_a7d3be29_mezclada', sizeKB: 205.1, type: 'audio.docx', date: '14 oct' },
  { name: 'grabacion_20251015_142015_f4e9ac72_mezclada', sizeKB: 210.8, type: 'audio.docx', date: '15 oct' },
  { name: 'grabacion_20251016_180940_9bc1dfe0_mezclada', sizeKB: 200.9, type: 'audio.docx', date: '16 oct' },
  { name: 'grabacion_20251017_204532_e13a7d6b_mezclada', sizeKB: 205.3, type: 'audio.docx', date: '17 oct' },
  { name: 'grabacion_20251018_071812_5f9e02cc_mezclada', sizeKB: 204.7, type: 'audio.docx', date: '18 oct' },
  { name: 'grabacion_20251019_153444_0a8c4ef9_mezclada', sizeKB: 201.6, type: 'audio.docx', date: '19 oct' },
  { name: 'grabacion_20251020_181946_d9d7fbf_mezclada',  sizeKB: 211.8, type: 'audio.docx', date: '20 oct' },
  { name: 'grabacion_20251021_230611_b67d5e8f_mezclada', sizeKB: 203.3, type: 'audio.docx', date: '21 oct' },
  { name: 'grabacion_20251022_104501_9de03a9c_mezclada', sizeKB: 199.4, type: 'audio.docx', date: '22 oct' },
  { name: 'grabacion_20251023_082045_c3f91c1d_mezclada', sizeKB: 208.2, type: 'audio.docx', date: '23 oct' },
  { name: 'grabacion_20251024_094510_4bde234a_mezclada', sizeKB: 216.9, type: 'audio.docx', date: '24 oct' },
  { name: 'grabacion_20251025_091015_dd45ee67_mezclada', sizeKB: 206.8, type: 'audio.docx', date: '25 oct' },
  { name: 'grabacion_20251026_133740_ee56ff78_mezclada', sizeKB: 202.5, type: 'audio.docx', date: '26 oct' },
  { name: 'grabacion_20251027_182205_ff67aa89_mezclada', sizeKB: 215.1, type: 'audio.docx', date: '27 oct' },
  { name: 'grabacion_20251028_074958_1199bbaa_mezclada', sizeKB: 198.7, type: 'audio.docx', date: '28 oct' },
  { name: 'grabacion_20251029_123406_22aabbcc_mezclada', sizeKB: 209.9, type: 'audio.docx', date: '29 oct' },
  { name: 'grabacion_20251030_164211_33bbccdd_mezclada', sizeKB: 204.2, type: 'audio.docx', date: '30 oct' },
  { name: 'grabacion_20251031_195922_44ccddee_mezclada', sizeKB: 212.4, type: 'audio.docx', date: '31 oct' },
  { name: 'grabacion_20251101_083055_55ddeeff_mezclada', sizeKB: 203.8, type: 'audio.docx', date: '1 nov' },
  { name: 'grabacion_20251102_100630_66eeffaa_mezclada', sizeKB: 208.6, type: 'audio.docx', date: '2 nov' },
  { name: 'grabacion_20251103_141215_77ffaabb_mezclada', sizeKB: 200.2, type: 'audio.docx', date: '3 nov' },
  { name: 'grabacion_20251104_173905_88aabbcc_mezclada', sizeKB: 214.7, type: 'audio.docx', date: '4 nov' },
  { name: 'grabacion_20251105_091842_99bbccdd_mezclada', sizeKB: 206.1, type: 'audio.docx', date: '5 nov' },
  { name: 'grabacion_20251106_112233_a1b2c3d4_mezclada', sizeKB: 205.0, type: 'audio.docx', date: '6 nov' },
  { name: 'grabacion_20251107_132425_b2c3d4e5_mezclada', sizeKB: 209.3, type: 'audio.docx', date: '7 nov' },
  { name: 'grabacion_20251108_154817_c3d4e5f6_mezclada', sizeKB: 202.9, type: 'audio.docx', date: '8 nov' },
  { name: 'grabacion_20251109_090201_d4e5f6a7_mezclada', sizeKB: 211.2, type: 'audio.docx', date: '9 nov' },
  { name: 'grabacion_20251110_121314_e5f6a7b8_mezclada', sizeKB: 198.3, type: 'audio.docx', date: '10 nov' },
  { name: 'grabacion_20251111_151617_f6a7b8c9_mezclada', sizeKB: 216.0, type: 'audio.docx', date: '11 nov' },
  { name: 'grabacion_20251112_181920_0a1b2c3d_mezclada', sizeKB: 203.1, type: 'audio.docx', date: '12 nov' },
  { name: 'grabacion_20251113_203345_1b2c3d4e_mezclada', sizeKB: 207.4, type: 'audio.docx', date: '13 nov' },
  { name: 'grabacion_20251114_223456_2c3d4e5f_mezclada', sizeKB: 204.6, type: 'audio.docx', date: '14 nov' },
]

export function TranscripcionesPage() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [dateText, setDateText] = useState('13/10/2025')
  const [items, setItems] = useState(MOCK_ITEMS)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoTarget, setInfoTarget] = useState(null)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [downloadTarget, setDownloadTarget] = useState(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items.slice()
    // Ordenar: fijados primero, manteniendo el orden relativo dentro de cada grupo
    return base.sort((a, b) => {
      const aPinned = !!a.pinned
      const bPinned = !!b.pinned
      if (aPinned === bPinned) return 0
      return aPinned ? -1 : 1
    })
  }, [query, items])

  const toggleOne = (name) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const toggleAll = () => {
    setSelected((prev) => {
      if (prev.size === filtered.length) return new Set()
      return new Set(filtered.map((i) => i.name))
    })
  }

  const handleDelete = (item) => {
    setDeleteTarget(item)
    setDeleteOpen(true)
  }

  const handleRename = (item) => {
    setRenameTarget(item.name)
    setRenameOpen(true)
  }

  const handleInfo = (item) => {
    setInfoTarget(item)
    setInfoOpen(true)
  }

  const handlePin = (item) => {
    setItems((prev) => prev.map((i) => (i.name === item.name ? { ...i, pinned: true } : i)))
  }

  const handleUnpin = (item) => {
    setItems((prev) => prev.map((i) => (i.name === item.name ? { ...i, pinned: false } : i)))
  }

  // Mover dentro del componente para tener acceso a setItems del estado
  const handleChangeType = (name, newType) => {
    setItems((prev) => prev.map((i) => (i.name === name ? { ...i, type: newType } : i)))
  }

  const handleDownload = (item) => {
    setDownloadTarget(item)
    setDownloadOpen(true)
  }

  const handleConfirmDownload = () => {
    // Aquí integrar la descarga real si se dispone de la URL
    console.log('Descargar', downloadTarget?.name)
    setDownloadOpen(false)
    setDownloadTarget(null)
  }

  const handleBulkDelete = () => {
    const count = selected.size
    if (count <= 0) return
    setBulkDeleteCount(count)
    setBulkDeleteOpen(true)
  }

  const handleConfirmBulkDelete = (cnt) => {
    console.log(`Eliminar seleccionados (${cnt})`)
    // Si se requiere eliminar realmente del listado:
    // setItems((prev) => prev.filter((i) => !selected.has(i.name)))
    setSelected(new Set())
    setBulkDeleteOpen(false)
    setBulkDeleteCount(0)
  }

  const handleBulkPin = () => {
    const names = new Set(selected)
    if (names.size <= 0) return
    setItems((prev) => prev.map((i) => (names.has(i.name) ? { ...i, pinned: true } : i)))
  }

  const handleBulkUnpin = () => {
    const names = new Set(selected)
    if (names.size <= 0) return
    setItems((prev) => prev.map((i) => (names.has(i.name) ? { ...i, pinned: false } : i)))
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Transcripciones</h1>
      <p className={styles.subtitle}>Grabaciones y transcripciones de Scrum de Scrums</p>

      <div className={styles.panel}>
        <div className={styles.toolbar}>
          <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
          <DateFilter value={dateText} onChange={(e) => setDateText(e.target.value)} />
        </div>

        <TranscriptionList
          items={filtered}
          selected={selected}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
          onDelete={handleDelete}
          onRename={handleRename}
          onPin={handlePin}
          onUnpin={handleUnpin}
          onInfo={handleInfo}
          onDownload={handleDownload}
          onBulkDelete={handleBulkDelete}
          onBulkPin={handleBulkPin}
          onBulkUnpin={handleBulkUnpin}
          selectedPinnedCount={items.filter((i) => selected.has(i.name) && i.pinned).length}
          onChangeType={handleChangeType}
        />
      </div>

      <RenameModal
        isOpen={renameOpen}
        onClose={() => setRenameOpen(false)}
        name={renameTarget}
        onConfirm={(newName) => console.log('Renombrar', renameTarget, '->', newName)}
      />

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        item={deleteTarget}
        onConfirm={(item) => console.log('Eliminar', item?.name)}
      />

      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} item={infoTarget} />

      <DownloadModal
        isOpen={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        onConfirm={handleConfirmDownload}
      />

      <BulkDeleteModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        count={bulkDeleteCount}
      />
    </div>
  )
}