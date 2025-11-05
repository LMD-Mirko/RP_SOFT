import { useState } from 'react'
import { Search } from 'lucide-react'
import { EvaluacionTecnicaModal } from '../components/EvaluacionTecnicaModal'
import styles from './EvaluacionTecnica.module.css'

export function EvaluacionTecnica() {
  const [showTable, setShowTable] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedPracticante, setSelectedPracticante] = useState(null)

  const practicantes = [
    {
      id: 1,
      nombres: 'Jared',
      apellidos: 'Fernández',
      servidor: 'Gto Py de Inscripción',
      proyecto: 'A',
      sala: 'A',
      estado: 'No evaluado',
      nota: '-'
    }
  ]

  const handleAplicarFiltros = () => {
    setShowTable(true)
  }

  const handleLimpiarFiltros = () => {
    setShowTable(false)
    setSelectedPracticante(null)
  }

  const handleEvaluar = (practicante) => {
    setSelectedPracticante(practicante)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPracticante(null)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            Evaluación Técnica
            <span className={styles.icon}>⚡</span>
          </h1>
          <p>Evalúa el desempeño técnico de cada practicante</p>
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

      {/* Stats */}
      <div className={styles.stats}>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.statIcon}>👤</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>20</div>
            <div className={styles.statLabel}>Practicantes Evaluados</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.red}`}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>10</div>
            <div className={styles.statLabel}>Practicantes en Riesgo</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>15</div>
            <div className={styles.statLabel}>Promedio General</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <h3>Filtros:</h3>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Practicante</label>
            <div className={styles.selectContainer}>
              <input type="text" placeholder="Filtrar por nombre o apellido" />
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
              <option>Todos los estados</option>
            </select>
          </div>
        </div>

        <div className={styles.filterActions}>
          <button 
            className={styles.applyButton}
            onClick={handleAplicarFiltros}
          >
            Aplicar Filtros
          </button>
          <button 
            className={styles.clearButton}
            onClick={handleLimpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Empty State or Table */}
      {!showTable ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h3>Selecciona un Prácticante</h3>
          <p>Elige un practicante aplicando los filtros de arriba para completar la evaluación</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
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
              {practicantes.map(practicante => (
                <tr key={practicante.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <span className={styles.highlight}>{practicante.nombres}</span>
                      <span className={styles.subtitle}>Medina</span>
                    </div>
                  </td>
                  <td>{practicante.apellidos}</td>
                  <td>{practicante.servidor}</td>
                  <td>{practicante.proyecto}</td>
                  <td>{practicante.sala}</td>
                  <td>
                    <span className={styles.badge}>{practicante.estado}</span>
                  </td>
                  <td>{practicante.nota}</td>
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
              🔻 Agregar comentarios
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <EvaluacionTecnicaModal
          practicante={selectedPracticante}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}