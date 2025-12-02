import { useState, useEffect } from 'react'  // Agregar useEffect
import { EvaluacionModal } from '../../../components/EvaluacionModal'
import { usePracticantes } from '../../../context/PracticantesContext'
import styles from './Evaluacion360UsuarioPage.module.css'

export function Evaluacion360UsuarioPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedPracticante, setSelectedPracticante] = useState(null)
  const [filters, setFilters] = useState({
    practicante: '',
    estado: ''
  })
  const [filteredPracticantes, setFilteredPracticantes] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [mostrarContenido, setMostrarContenido] = useState(false) // NUEVO: Estado para animaciones
  const [filtroActivo, setFiltroActivo] = useState('todos') // NUEVO: Filtros rápidos
  
  const { practicantes } = usePracticantes()

  // NUEVO: Efecto para animación de entrada
  useEffect(() => {
    setMostrarContenido(true)
  }, [])

  const handleEvaluar = (practicante) => {
    setSelectedPracticante(practicante)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPracticante(null)
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApplyFilters = () => {
    setHasSearched(true)
    
    console.log('=== DEBUG FILTROS ===')
    console.log('Practicantes disponibles:', practicantes)
    console.log('Filtro aplicado:', filters)
    
    let results = [...practicantes]

    // Filtrar por nombre/apellido solo si hay texto
    if (filters.practicante && filters.practicante.trim()) {
      const searchTerm = filters.practicante.toLowerCase().trim()
      console.log('Buscando:', searchTerm)
      
      results = results.filter(p => {
        const matchNombre = p.nombres && p.nombres.toLowerCase().includes(searchTerm)
        const matchApellido = p.apellidos && p.apellidos.toLowerCase().includes(searchTerm)
        console.log(`Practicante: ${p.nombres} ${p.apellidos} - Match: ${matchNombre || matchApellido}`)
        return matchNombre || matchApellido
      })
      
      console.log('Resultados después de filtrar por nombre:', results)
    }

    // Filtrar por estado
    if (filters.estado) {
      results = results.filter(p => {
        if (filters.estado === 'evaluado') {
          return p.evaluacion360 !== null && p.evaluacion360 !== undefined
        } else if (filters.estado === 'no-evaluado') {
          return p.evaluacion360 === null || p.evaluacion360 === undefined
        }
        return true
      })
      console.log('Resultados después de filtrar por estado:', results)
    }

    console.log('Resultados finales:', results)
    console.log('=== FIN DEBUG ===')
    setFilteredPracticantes(results)
  }

  const handleClearFilters = () => {
    setFilters({
      practicante: '',
      estado: ''
    })
    setFilteredPracticantes([])
    setHasSearched(false)
  }

  return (
    <div className={`${styles.container} ${mostrarContenido ? styles.fadeIn : ''}`}>
      {/* Header - CON ANIMACIÓN */}
      <div className={`${styles.header} ${styles.slideIn}`}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            Evaluación 360
            <span className={styles.icon}>⚙</span>
          </h1>
          <p className={styles.subtitle}>
            Administra las evaluaciones 360 de los practicantes
          </p>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Selecciona una semana"
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Info Banner - CON ANIMACIÓN */}
      <div className={`${styles.infoBanner} ${styles.slideIn}`} style={{animationDelay: '0.1s'}}>
        <div className={styles.infoIcon}>ℹ</div>
        <div className={styles.infoContent}>
          <strong>Evaluación Real</strong>
          <p>Tus evaluaciones las verán mentores con los resultados consolidados 54 honestas y constructivas</p>
        </div>
      </div>

      {/* NUEVO: SELECTORES MEJORADOS */}
      <div className={styles.filtrosContainer}>
        <button 
          className={`${styles.filtroBtn} ${filtroActivo === 'todos' ? styles.filtroBtnActive : ''}`}
          onClick={() => setFiltroActivo('todos')}
        >
          Todos los Practicantes
        </button>
        <button 
          className={`${styles.filtroBtn} ${filtroActivo === 'evaluados' ? styles.filtroBtnActive : ''}`}
          onClick={() => setFiltroActivo('evaluados')}
        >
          Evaluados ({practicantes.filter(p => p.evaluacion360).length})
        </button>
        <button 
          className={`${styles.filtroBtn} ${filtroActivo === 'no-evaluados' ? styles.filtroBtnActive : ''}`}
          onClick={() => setFiltroActivo('no-evaluados')}
        >
          No Evaluados ({practicantes.filter(p => !p.evaluacion360).length})
        </button>
      </div>

      {/* Filters - CON ANIMACIÓN */}
      <div className={`${styles.filtersSection} ${styles.slideIn}`} style={{animationDelay: '0.2s'}}>
        <h3 className={styles.filtersTitle}>Filtros Avanzados:</h3>
        
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Practicante</label>
            <input
              type="text"
              className={styles.filterInput}
              placeholder="🔍 Busca por nombres o apellidos"
              value={filters.practicante}
              onChange={(e) => handleFilterChange('practicante', e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Estado</label>
            <select 
              className={styles.filterSelect}
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="evaluado">Evaluado</option>
              <option value="no-evaluado">No evaluado</option>
            </select>
          </div>
        </div>

        <div className={styles.filterActions}>
          <button className={styles.applyButton} onClick={handleApplyFilters}>
            Aplicar Filtros
          </button>
          <button className={styles.clearButton} onClick={handleClearFilters}>
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Table or Empty State - CON ANIMACIONES */}
      {!hasSearched ? (
        <div className={`${styles.emptyState} ${styles.slideIn}`} style={{animationDelay: '0.3s'}}>
          <div className={styles.emptyIcon}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="30" r="15" stroke="#CBD5E1" strokeWidth="2"/>
              <path d="M25 45 Q25 40 30 40 L50 40 Q55 40 55 45 L55 60 Q55 65 50 65 L30 65 Q25 65 25 60 Z" 
                    stroke="#CBD5E1" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Busca un Practicante</h3>
          <p className={styles.emptyText}>
            Usa los filtros de arriba para buscar al practicante que deseas evaluar
          </p>
        </div>
      ) : filteredPracticantes.length > 0 ? (
        <div className={`${styles.tableContainer} ${styles.slideIn}`} style={{animationDelay: '0.3s'}}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Servidor</th>
                <th>Proyecto</th>
                <th>Sala</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPracticantes.map((practicante, index) => (
                <tr 
                  key={practicante.id}
                  className={styles.slideIn}
                  style={{animationDelay: `${0.4 + (index * 0.05)}s`}}
                >
                  <td>{practicante.nombres}</td>
                  <td>{practicante.apellidos}</td>
                  <td>{practicante.servidor}</td>
                  <td>{practicante.proyecto}</td>
                  <td>{practicante.sala}</td>
                  <td>
                    <span className={`${styles.estadoBadge} ${
                      practicante.evaluacion360 ? styles.estadoEvaluado : styles.estadoNoEvaluado
                    }`}>
                      {practicante.evaluacion360 ? 'Evaluado' : 'No evaluado'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.evaluarButton}
                      onClick={() => handleEvaluar(practicante)}
                    >
                      Evaluar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`${styles.emptyState} ${styles.slideIn}`} style={{animationDelay: '0.3s'}}>
          <div className={styles.emptyIcon}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="30" stroke="#CBD5E1" strokeWidth="2"/>
              <line x1="40" y1="30" x2="40" y2="45" stroke="#CBD5E1" strokeWidth="2"/>
              <circle cx="40" cy="52" r="2" fill="#CBD5E1"/>
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No se encontraron resultados</h3>
          <p className={styles.emptyText}>
            No hay practicantes que coincidan con los filtros aplicados
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <EvaluacionModal
          practicante={selectedPracticante}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}