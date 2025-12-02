import { useState, useEffect } from 'react'
import { Download, Mail, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { StatsCards } from '../components/StatsCards'
import { SearchAndFilters } from '../components/SearchAndFilters'
import { PracticanteCard } from '../components/PracticanteCard'
import { usePracticantes } from '../hooks'
import styles from './Dashboard.module.css'

// Función para transformar datos del backend al formato esperado por el frontend
const transformPracticante = (practicante) => {
  const nombreCompleto = `${practicante.nombre || ''} ${practicante.apellido || ''}`.trim()
  const iniciales = nombreCompleto
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return {
    id: practicante.id,
    nombre: nombreCompleto || practicante.correo?.split('@')[0] || 'Sin nombre',
    email: practicante.correo || practicante.email || '',
    equipo: practicante.equipo || 'Rpsoft • Team Alpha',
    servidor: practicante.servidor || 'rpsoft',
    estado: practicante.estado || 'activo',
    cohorte: practicante.cohorte || 'Cohorte 2024-A',
    score: practicante.score || 0,
    asistencia: practicante.asistencia || '0%',
    infracciones: practicante.infracciones || 0,
    avatar: iniciales || 'NA',
    color: practicante.color || '#3b82f6'
  }
}

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedServer, setSelectedServer] = useState('todos')
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [selectedCohort, setSelectedCohort] = useState('todas')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Usar el hook para obtener practicantes
  const { 
    practicantes: practicantesData, 
    loading, 
    pagination,
    loadPracticantes 
  } = usePracticantes({
    estado: selectedStatus !== 'todos' ? selectedStatus : undefined,
    nombre: searchTerm || undefined,
    correo: searchTerm || undefined,
  })

  // Cargar practicantes cuando cambian los filtros
  useEffect(() => {
    const params = {}
    if (selectedStatus !== 'todos') {
      params.estado = selectedStatus
    }
    if (searchTerm) {
      params.nombre = searchTerm
    }
    loadPracticantes(currentPage, params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedStatus, searchTerm])

  // Transformar datos del backend al formato del frontend
  const practicantes = (practicantesData && Array.isArray(practicantesData) && practicantesData.length > 0)
    ? practicantesData.map(transformPracticante)
    : []

  // Usar paginación del backend si está disponible
  const totalPages = pagination.total 
    ? Math.ceil(pagination.total / itemsPerPage)
    : Math.ceil(practicantes.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPracticantes = practicantes.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Directorio de Practicantes</h1>
          <p>Gestiona y monitorea a todos los practicantes del programa</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.exportButton}>
            <Download size={16} />
            Exportar
          </button>
          <button className={styles.emailButton}>
            <Mail size={16} />
            Email Masivo
          </button>
          <button className={styles.addButton}>
            <Plus size={16} />
            Agregar Practicante
          </button>
        </div>
      </div>

      <StatsCards />

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedServer={selectedServer}
        onServerChange={setSelectedServer}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCohort={selectedCohort}
        onCohortChange={setSelectedCohort}
      />

      <div className={styles.practicantesGrid}>
        {loading ? (
          <div className={styles.loadingMessage}>Cargando practicantes...</div>
        ) : currentPracticantes.length > 0 ? (
          currentPracticantes.map(practicante => (
            <PracticanteCard key={practicante.id} practicante={practicante} />
          ))
        ) : (
          <div className={styles.emptyMessage}>No se encontraron practicantes</div>
        )}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </button>
        <span className={styles.paginationInfo}>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className={styles.paginationButton}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}