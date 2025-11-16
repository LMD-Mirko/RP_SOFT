/**
 * Componente SearchBar
 * Barra de búsqueda con filtros y botón de descarga
 */

import { Search, ChevronDown, Download } from 'lucide-react'
import styles from '../styles/Dashboard.module.css'

export function SearchBar({ searchTerm, onSearchChange, filterValue, onFilterChange, onDownload }) {
  return (
    <div className={styles.searchBar}>
      {/* Barra de búsqueda */}
      <div className={styles.searchWrapper}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Dropdown de filtros */}
      <button className={styles.filterButton}>
        <span>{filterValue}</span>
        <ChevronDown size={16} />
      </button>

      {/* Botón de descarga */}
      <button className={styles.downloadButton} onClick={onDownload} aria-label="Descargar">
        <Download size={20} />
      </button>
    </div>
  )
}
