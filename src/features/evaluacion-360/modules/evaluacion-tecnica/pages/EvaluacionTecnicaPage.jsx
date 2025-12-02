import { useState, useMemo, useEffect } from 'react'  // Agregar useEffect
import { Code2 } from 'lucide-react'
import { EvaluacionTecnicaModal } from '../../../components/EvaluacionTecnicaModal'
import { usePracticantes } from '../../../context/PracticantesContext'
import styles from './EvaluacionTecnicaPage.module.css'

export function EvaluacionTecnicaPage() {
  const [selectedPracticante, setSelectedPracticante] = useState(null)
  const [filters, setFilters] = useState({
    practicante: '',
    servidor: '',
    estado: '',
    proyecto: '',
    sala: '',
    enRiesgo: ''
  })
  const [mostrarContenido, setMostrarContenido] = useState(false) // NUEVO: Estado para animaciones
  const [filtroActivo, setFiltroActivo] = useState('todos') // NUEVO: Filtros rápidos
  
  const { practicantes } = usePracticantes()

  // NUEVO: Efecto para animación de entrada
  useEffect(() => {
    setMostrarContenido(true)
  }, [])

  const filteredPracticantes = useMemo(() => {
    if (!filters.practicante) return []
    
    const searchTerm = filters.practicante.toLowerCase()
    return practicantes.filter(p => 
      p.nombres.toLowerCase().includes(searchTerm) ||
      p.apellidos.toLowerCase().includes(searchTerm)
    )
  }, [practicantes, filters.practicante])

  // Datos de ejemplo
  const stats = {
    practicantesEvaluados: 20,
    practicantesEnRiesgo: 10,
    promedioGeneral: 15
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApplyFilters = () => {
    console.log('Aplicando filtros:', filters)
  }

  const handleClearFilters = () => {
    setFilters({
      practicante: '',
      servidor: '',
      estado: '',
      proyecto: '',
      sala: '',
      enRiesgo: ''
    })
  }

  const handleSelectPracticante = (practicante) => {
    setSelectedPracticante(practicante)
  }

  return (
    <div className={`${styles.container} ${mostrarContenido ? styles.fadeIn : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            Evaluación Técnica
            <span className={styles.icon}>
              <Code2 className="w-6 h-6" />
            </span>
          </h1>
          <p className={styles.subtitle}>
            Evalúa el desempeño técnico de cada practicante
          </p>
          <p className={styles.hint}>
            ⓘ Selecciona un(a) técnico(a)
          </p>
        </div>

        {/* Stats - CON ANIMACIÓN */}
        <div className={`${styles.stats} ${styles.slideIn}`} style={{animationDelay: '0.1s'}}>
          <div className={styles.statCard} style={{ backgroundColor: '#E3F2FD' }}>
            <div className={styles.statIcon} style={{ color: '#1976D2' }}>
              <Code2 className="w-5 h-5" />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.practicantesEvaluados}</div>
              <div className={styles.statLabel}>Practicantes Evaluados</div>
            </div>
          </div>

          <div className={styles.statCard} style={{ backgroundColor: '#FFEBEE' }}>
            <div className={styles.statIcon} style={{ color: '#D32F2F' }}>
              ⚠
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.practicantesEnRiesgo}</div>
              <div className={styles.statLabel}>Practicantes en Riesgo</div>
            </div>
          </div>

          <div className={styles.statCard} style={{ backgroundColor: '#E8F5E9' }}>
            <div className={styles.statIcon} style={{ color: '#388E3C' }}>
              💬
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.promedioGeneral}</div>
              <div className={styles.statLabel}>Promedio General</div>
            </div>
          </div>
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
          Evaluados ({practicantes.filter(p => p.evaluacionTecnica).length})
        </button>
        <button 
          className={`${styles.filtroBtn} ${filtroActivo === 'no-evaluados' ? styles.filtroBtnActive : ''}`}
          onClick={() => setFiltroActivo('no-evaluados')}
        >
          No Evaluados ({practicantes.filter(p => !p.evaluacionTecnica).length})
        </button>
        <button 
          className={`${styles.filtroBtn} ${filtroActivo === 'riesgo' ? styles.filtroBtnActive : ''}`}
          onClick={() => setFiltroActivo('riesgo')}
        >
          En Riesgo (10)
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
              className={styles.filterSelect}
              placeholder="🔍 Busca por apellido o nombre"
              value={filters.practicante}
              onChange={(e) => handleFilterChange('practicante', e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Servidor</label>
            <select 
              className={styles.filterSelect}
              value={filters.servidor}
              onChange={(e) => handleFilterChange('servidor', e.target.value)}
            >
              <option value="">Todos los servidores</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Estado</label>
            <select 
              className={styles.filterSelect}
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
            >
              <option value="">Todos los estados</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Proyecto</label>
            <select 
              className={styles.filterSelect}
              value={filters.proyecto}
              onChange={(e) => handleFilterChange('proyecto', e.target.value)}
            >
              <option value="">Todos los proyectos</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sala</label>
            <select 
              className={styles.filterSelect}
              value={filters.sala}
              onChange={(e) => handleFilterChange('sala', e.target.value)}
            >
              <option value="">Todas las salas</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>En Riesgo</label>
            <select 
              className={styles.filterSelect}
              value={filters.enRiesgo}
              onChange={(e) => handleFilterChange('enRiesgo', e.target.value)}
            >
              <option value="">Todos los estados</option>
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

      {filteredPracticantes.length > 0 ? (
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
                <th>Nota</th>
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
                      practicante.evaluacionTecnica ? styles.estadoEvaluado : styles.estadoNoEvaluado
                    }`}>
                      {practicante.evaluacionTecnica ? 'Evaluado' : 'No evaluado'}
                    </span>
                  </td>
                  <td>{practicante.notaTecnica}</td>
                  <td>
                    <button
                      className={styles.evaluarButton}
                      onClick={() => handleSelectPracticante(practicante)}
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
              <circle cx="40" cy="30" r="15" stroke="#CBD5E1" strokeWidth="2"/>
              <path d="M25 45 Q25 40 30 40 L50 40 Q55 40 55 45 L55 60 Q55 65 50 65 L30 65 Q25 65 25 60 Z" 
                    stroke="#CBD5E1" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Selecciona un Prácticante</h3>
          <p className={styles.emptyText}>
            Elige el practicante aplicando los filtros de arriba para comenzar la evaluación
          </p>
        </div>
      )}

      {selectedPracticante && (
        <EvaluacionTecnicaModal
          practicante={selectedPracticante}
          onClose={() => setSelectedPracticante(null)}
        />
      )}
    </div>
  )
}