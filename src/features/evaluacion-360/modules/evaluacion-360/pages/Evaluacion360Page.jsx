import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { EvaluacionModal } from '../../../components/EvaluacionModal'
import styles from './Evaluacion360Page.module.css'

export function Evaluacion360Page() {
  const [showModal, setShowModal] = useState(false)
  const [selectedPracticante, setSelectedPracticante] = useState(null)

  const practicantes = [
    {
      id: 1,
      nombres: 'Jared',
      apellidos: 'Fernandez',
      servidor: 'Gto Py de Medina',
      proyecto: 'Innovación',
      sala: '-',
      estado: 'No evaluado',
      nota: '-'
    }
  ]

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

      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <div className={styles.infoIcon}></div>
        <div>
          <strong>Evaluación Real</strong>
          <p>Las evaluaciones las verán mentores con los resultados consolidados 54 honestas y constructivas</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>20</div>
          <div className={styles.statLabel}>Practicantes Evaluados</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>10</div>
          <div className={styles.statLabel}>Practicantes en Riesgo</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>15</div>
          <div className={styles.statLabel}>Promedio General</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <h3>Filtros:</h3>
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

      {/* Table */}
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
                <td>{practicante.nombres}</td>
                <td>{practicante.apellidos}</td>
                <td>{practicante.servidor}</td>
                <td>{practicante.proyecto}</td>
                <td>{practicante.sala}</td>
                <td>{practicante.estado}</td>
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

