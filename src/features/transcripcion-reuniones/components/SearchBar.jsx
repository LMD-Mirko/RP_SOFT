import { Search } from 'lucide-react'
import styles from '../pages/TranscripcionesPage.module.css'

export function SearchBar({ value, onChange, placeholder = 'Buscar en las transcripciones...' }) {
  return (
    <div className={styles.searchBox}>
      <Search size={18} />
      <input value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}