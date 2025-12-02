import { useRef, useState, useEffect, forwardRef } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactDatePicker from 'react-datepicker'
import { es as esLocale } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import layoutStyles from '../../modules/grabaciones/pages/TranscripcionesPage.module.css'
import styles from './DateFilter.module.css'

function parseDMYString(str) {
  if (!str || typeof str !== 'string') return null
  const parts = str.split('/')
  if (parts.length !== 3) return null
  const [d, m, y] = parts.map((p) => parseInt(p, 10))
  if (!y || !m || !d) return null
  const dt = new Date(y, m - 1, d)
  return Number.isNaN(dt.getTime()) ? null : dt
}

function formatDMY(date) {
  if (!date) return ''
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = String(date.getFullYear())
  return `${d}/${m}/${y}`
}

const PlainInput = forwardRef(function PlainInput({ value, onClick, onChange }, ref) {
  return (
    <input
      ref={ref}
      className={layoutStyles.dateInput}
      value={value}
      onClick={onClick}
      onChange={onChange}
      readOnly
    />
  )
})

export function DateFilter({ value, onChange }) {
  const [selected, setSelected] = useState(parseDMYString(value) || new Date())
  const inputRef = useRef(null)
  const pickerRef = useRef(null)

  useEffect(() => {
    const parsed = parseDMYString(value)
    if (parsed) setSelected(parsed)
  }, [value])

  const handleSelect = (date) => {
    setSelected(date)
    const formatted = formatDMY(date)
    onChange?.({ target: { value: formatted } })
  }

  const renderHeader = ({ date, decreaseMonth, increaseMonth }) => {
    const month = date.toLocaleString('es-ES', { month: 'long' })
    const year = date.getFullYear()
    return (
      <div className={styles.header}>
        <button type="button" className={styles.navBtn} onClick={decreaseMonth}>
          <ChevronLeft size={18} />
        </button>
        <div className={styles.headerTitle}>{month} {year}</div>
        <button type="button" className={styles.navBtn} onClick={increaseMonth}>
          <ChevronRight size={18} />
        </button>
      </div>
    )
  }


  return (
    <div className={layoutStyles.dateBox}>
      <ReactDatePicker
        ref={pickerRef}
        selected={selected}
        onChange={handleSelect}
        customInput={<PlainInput ref={inputRef} value={formatDMY(selected)} />}
        calendarClassName={styles.calendar}
        popperClassName={styles.popper}
        renderCustomHeader={renderHeader}
        showPopperArrow={false}
        shouldCloseOnSelect
        dateFormat="dd/MM/yyyy"
        locale={esLocale}
      />
      <CalendarIcon
        size={18}
        onClick={() => { pickerRef.current?.setOpen(true); inputRef.current?.focus() }}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )
}