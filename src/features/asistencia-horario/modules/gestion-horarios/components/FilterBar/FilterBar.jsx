import { Filter } from 'lucide-react'
import styles from './FilterBar.module.css'

export function FilterBar() {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <Filter className={styles.filterIcon} size={18} strokeWidth={1.5} />
        <label className={styles.filterLabel}>Filtrar por servidor</label>
        <select className={styles.filterSelect}>
          <option value="todos">Todos los servidores</option>
          <option value="rpsoft">Rpsoft</option>
          <option value="innovacion">Innovacion</option>
          <option value="laboratorios">Laboratorios</option>
          <option value="minibootcamp">MiniBootcamp</option>
          <option value="recuperacion">Recuperacion</option>
        </select>
      </div>
    </div>
  )
}
