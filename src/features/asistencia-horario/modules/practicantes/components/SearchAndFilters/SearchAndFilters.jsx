import { Search, ChevronDown } from 'lucide-react'
import styles from './SearchAndFilters.module.css'

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedServer,
  onServerChange,
  selectedStatus,
  onStatusChange,
  selectedCohort,
  onCohortChange
}) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filtersGroup}>
        <div className={styles.filterSelect}>
          <select
            value={selectedServer}
            onChange={(e) => onServerChange(e.target.value)}
            className={styles.select}
          >
            <option value="todos">Todos los servidores</option>
            <option value="rpsoft">Rpsoft</option>
            <option value="innovacion">Innovacion</option>
            <option value="laboratorios">Laboratorios</option>
            <option value="minibootcamp">MiniBootcamp</option>
            <option value="recuperacion">Recuperacion</option>
          </select>
          <ChevronDown size={16} className={styles.selectIcon} />
        </div>

        <div className={styles.filterSelect}>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={styles.select}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="recuperacion">En Recuperación</option>
            <option value="riesgo">En Riesgo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <ChevronDown size={16} className={styles.selectIcon} />
        </div>

        <div className={styles.filterSelect}>
          <select
            value={selectedCohort}
            onChange={(e) => onCohortChange(e.target.value)}
            className={styles.select}
          >
            <option value="todas">Todas las cohortes</option>
            <option value="2024-A">Cohorte 2024-A</option>
            <option value="2024-B">Cohorte 2024-B</option>
            <option value="2023-B">Cohorte 2023-B</option>
          </select>
          <ChevronDown size={16} className={styles.selectIcon} />
        </div>
      </div>
    </div>
  )
}