import { useState } from 'react'
import { Download, Mail, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { StatsCards } from '../components/StatsCards'
import { SearchAndFilters } from '../components/SearchAndFilters'
import { PracticanteCard } from '../components/PracticanteCard'
import styles from './Dashboard.module.css'

// Datos de ejemplo basados en el diseño
const mockPracticantes = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@rpsoft.com',
    equipo: 'Rpsoft • Team Alpha',
    servidor: 'rpsoft',
    estado: 'activo',
    cohorte: 'Cohorte 2024-A',
    score: 850,
    asistencia: '98%',
    infracciones: 0,
    avatar: 'JP',
    color: '#3b82f6'
  },
  {
    id: 2,
    nombre: 'María López',
    email: 'maria.lopez@rpsoft.com',
    equipo: 'Innovacion • Team Beta',
    servidor: 'innovacion',
    estado: 'activo',
    cohorte: 'Cohorte 2024-A',
    score: 620,
    asistencia: '95%',
    infracciones: 0,
    avatar: 'ML',
    color: '#3b82f6'
  },
  {
    id: 3,
    nombre: 'Carlos Ruiz',
    email: 'carlos.ruiz@rpsoft.com',
    equipo: 'Laboratorios • Team Gamma',
    servidor: 'laboratorios',
    estado: 'riesgo',
    cohorte: 'Cohorte 2024-B',
    score: 380,
    asistencia: '88%',
    infracciones: 1,
    avatar: 'CR',
    color: '#3b82f6'
  },
  {
    id: 4,
    nombre: 'Ana García',
    email: 'ana.garcia@rpsoft.com',
    equipo: 'Recuperacion • Team Delta',
    servidor: 'recuperacion',
    estado: 'recuperacion',
    cohorte: 'Cohorte 2023-B',
    score: 150,
    asistencia: '75%',
    infracciones: 3,
    avatar: 'AG',
    color: '#ef4444'
  },
  {
    id: 5,
    nombre: 'Luis Martínez',
    email: 'luis.martinez@rpsoft.com',
    equipo: 'MiniBootcamp • Team Epsilon',
    servidor: 'minibootcamp',
    estado: 'activo',
    cohorte: 'Cohorte 2024-B',
    score: 520,
    asistencia: '92%',
    infracciones: 0,
    avatar: 'LM',
    color: '#3b82f6'
  },
  {
    id: 6,
    nombre: 'Pedro Sánchez',
    email: 'pedro.sanchez@rpsoft.com',
    equipo: 'Rpsoft • Team Beta',
    servidor: 'rpsoft',
    estado: 'inactivo',
    cohorte: 'Cohorte 2023-B',
    score: 0,
    asistencia: '0%',
    infracciones: 5,
    avatar: 'PS',
    color: '#6b7280'
  },
  {
    id: 7,
    nombre: 'Sofia Torres',
    email: 'sofia.torres@rpsoft.com',
    equipo: 'Innovacion • Team Gamma',
    servidor: 'innovacion',
    estado: 'activo',
    cohorte: 'Cohorte 2024-A',
    score: 720,
    asistencia: '96%',
    infracciones: 0,
    avatar: 'ST',
    color: '#3b82f6'
  },
  {
    id: 8,
    nombre: 'Diego Ramírez',
    email: 'diego.ramirez@rpsoft.com',
    equipo: 'Laboratorios • Team Delta',
    servidor: 'laboratorios',
    estado: 'activo',
    cohorte: 'Cohorte 2024-B',
    score: 680,
    asistencia: '94%',
    infracciones: 1,
    avatar: 'DR',
    color: '#3b82f6'
  }
]

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedServer, setSelectedServer] = useState('todos')
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [selectedCohort, setSelectedCohort] = useState('todas')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredPracticantes = mockPracticantes.filter(practicante => {
    const matchesSearch = practicante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practicante.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesServer = selectedServer === 'todos' ||
      practicante.servidor === selectedServer

    const matchesStatus = selectedStatus === 'todos' ||
      practicante.estado === selectedStatus

    const matchesCohort = selectedCohort === 'todas' ||
      practicante.cohorte.includes(selectedCohort)

    return matchesSearch && matchesServer && matchesStatus && matchesCohort
  })

  const totalPages = Math.ceil(filteredPracticantes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPracticantes = filteredPracticantes.slice(startIndex, endIndex)

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
        {currentPracticantes.map(practicante => (
          <PracticanteCard key={practicante.id} practicante={practicante} />
        ))}
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