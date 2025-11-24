import { useState, useEffect } from 'react'  // Cambié import para incluir useEffect
import { Search, ChevronDown } from 'lucide-react'
import { EvaluacionModal } from '../../../components/EvaluacionModal'
import { usePracticantes } from '../../../context/PracticantesContext'
import styles from './Evaluacion360Page.module.css'

export function Evaluacion360Page() {
  const [showModal, setShowModal] = useState(false)
  const [selectedPracticante, setSelectedPracticante] = useState(null)
  const { practicantes } = usePracticantes()
  
  // NUEVO: Estado para animaciones y filtros mejorados
  const [mostrarContenido, setMostrarContenido] = useState(false)
  const [filtroActivo, setFiltroActivo] = useState('todos')

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

  return (
    <div className={`${styles.container} ${mostrarContenido ? styles.fadeIn : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Evaluación 360°</h1>
          <p>Administra las evaluaciones 360 de los practicantes</p>
        </div>

        <div className={styles.searchContainer}>
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Selecciona una semana"
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Info Banner - CON ANIMACIÓN */}
      <div className={`${styles.infoBanner} ${styles.slideIn}`}>
        <div className={styles.infoIcon}></div>
        <div>
          <strong>Evaluación Real</strong>
          <p>Las evaluaciones las verán mentores con los resultados consolidados 54 honestas y constructivas</p>
        </div>
      </div>

      {/* Stats - CON ANIMACIÓN */}
      <div className={`${styles.stats} ${styles.slideIn}`} style={{animationDelay: '0.1s'}}>
        <div className={styles.statCard} style={{ backgroundColor: '#E3F2FD' }}>
          <div className={styles.statIcon} style={{ color: '#1976D2' }}>
            <Search className="w-5 h-5" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>20</div>
            <div className={styles.statLabel}>Practicantes Evaluados</div>
          </div>
        </div>

        <div className={styles.statCard} style={{ backgroundColor: '#FFEBEE' }}>
          <div className={styles.statIcon} style={{ color: '#D32F2F' }}>
            ⚠
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>10</div>
            <div className={styles.statLabel}>Practicantes en Riesgo</div>
          </div>
        </div>

        <div className={styles.statCard} style={{ backgroundColor: '#E8F5E9' }}>
          <div className={styles.statIcon} style={{ color: '#388E3C' }}>
            💬
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>15</div>
            <div className={styles.statLabel}>Promedio General</div>
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
          Evaluados ({practicantes.filter(p => p.evaluacion360).length})
        </button>
        <button 
          className={`${styles.filtroBtn} ${filtroActivo === 'no-evaluados' ? styles.filtroBtnActive : ''}`}
          onClick={() => setFiltroActivo('no-evaluados')}
        >
          No Evaluados ({practicantes.filter(p => !p.evaluacion360).length})
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
        <h3>Filtros Avanzados:</h3>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Practicante</label>
            <div className={styles.selectContainer}>
              <input type="text" placeholder="Busca por nombres o apellidos" />
              <Search className="w-4 h-4" />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Servidor</label>
            <select className={styles.select}>
              <option>Todos los servidores</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Estado</label>
            <select className={styles.select}>
              <option>Todos los estados</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Proyecto</label>
            <select className={styles.select}>
              <option>Todos los proyectos</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Sala</label>
            <select className={styles.select}>
              <option>Todas las salas</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>En Riesgo</label>
            <select className={styles.select}>
              <option>Cualquiera</option>
            </select>
          </div>
        </div>

        <div className={styles.filterActions}>
          <button className={styles.applyButton}>Aplicar Filtros</button>
          <button className={styles.clearButton}>Limpiar Filtros</button>
        </div>
      </div>

      {/* Table - CON ANIMACIÓN */}
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
            {practicantes.map((practicante, index) => (
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
                <td>{practicante.nota360}</td>
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

        <div className={styles.tableFooter}>
          <button className={styles.expandButton}>
            <ChevronDown className="w-4 h-4" />
            Agregar comentarios
          </button>
        </div>
      </div>

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