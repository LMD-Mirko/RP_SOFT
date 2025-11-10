import { useRef } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import styles from '../pages/TranscripcionesPage.module.css'

export function DateFilter({ value, onChange }) {
  const nativeRef = useRef(null)

  const openPicker = () => {
    const el = nativeRef.current
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.focus()
  }

  const handleNativeChange = (e) => {
    const iso = e.target.value // yyyy-mm-dd
    if (!iso) return
    const [y, m, d] = iso.split('-')
    const formatted = `${d}/${m}/${y}`
    onChange?.({ target: { value: formatted } })
  }

  return (
    <div className={styles.dateBox}>
      <input
        className={styles.dateInput}
        value={value}
        onChange={onChange}
        onClick={openPicker}
      />
      <CalendarIcon size={18} onClick={openPicker} style={{ cursor: 'pointer' }} />
      <input
        type="date"
        ref={nativeRef}
        onChange={handleNativeChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
    </div>
  )
}