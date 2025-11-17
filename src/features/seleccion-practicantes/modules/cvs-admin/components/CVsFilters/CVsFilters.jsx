import { Search, Filter, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import styles from './CVsFilters.module.css'

export function CVsFilters({ 
  onFilterChange, 
  onSearchChange,
  searchTerm = '',
  filters = {}
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(localSearchTerm)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearchTerm, onSearchChange])

  const handleClearFilters = () => {
    setLocalSearchTerm('')
    if (onSearchChange) {
      onSearchChange('')
    }
    if (onFilterChange) {
      onFilterChange({
        postulant_id: null,
        job_posting_id: null,
      })
    }
  }

  const hasActiveFilters = filters.postulant_id || filters.job_posting_id || localSearchTerm

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o archivo..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {localSearchTerm && (
            <button
              className={styles.clearButton}
              onClick={() => setLocalSearchTerm('')}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <button
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
          data-active={showFilters}
        >
          <Filter size={18} />
          Filtros
          {hasActiveFilters && <span className={styles.badge}>1</span>}
        </button>

        {hasActiveFilters && (
          <button
            className={styles.clearFiltersButton}
            onClick={handleClearFilters}
          >
            <X size={16} />
            Limpiar
          </button>
        )}
      </div>

      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>
              ID de Postulante
              <input
                type="number"
                placeholder="Ej: 1, 2, 3..."
                value={filters.postulant_id || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null
                  if (onFilterChange) {
                    onFilterChange({ ...filters, postulant_id: value })
                  }
                }}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>
              ID de Convocatoria
              <input
                type="number"
                placeholder="Ej: 1, 2, 3..."
                value={filters.job_posting_id || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null
                  if (onFilterChange) {
                    onFilterChange({ ...filters, job_posting_id: value })
                  }
                }}
                className={styles.input}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

