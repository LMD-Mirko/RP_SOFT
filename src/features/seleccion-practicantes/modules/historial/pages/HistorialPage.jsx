import { useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import { ActivityFilter } from '../components/ActivityFilter'
import { ActivityList } from '../components/ActivityList'
import { ActivityDetailModal } from '../components/ActivityDetailModal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import styles from './HistorialPage.module.css'

// Datos mock de actividades
const mockActivities = [
  {
    id: 1,
    type: 'creacion',
    description: 'Convocatoria Enero 2025 creada',
    actor: 'Carlos Mendoza',
    timestamp: '2025-01-20 14:30',
  },
  {
    id: 2,
    type: 'cambio',
    description: 'Juan Pérez movido a Prueba Técnica',
    actor: 'Carlos Mendoza',
    timestamp: '2025-01-19 10:15',
  },
  {
    id: 3,
    type: 'evaluacion',
    description: 'Puntaje 85 registrado para María García',
    actor: 'Carlos Mendoza',
    timestamp: '2025-01-18 16:45',
  },
  {
    id: 4,
    type: 'rechazo',
    description: 'Carlos López rechazado del proceso',
    actor: 'Carlos Mendoza',
    timestamp: '2025-01-17 09:20',
  },
  {
    id: 5,
    type: 'creacion',
    description: 'Convocatoria Diciembre 2024 creada',
    actor: 'Ana Torres',
    timestamp: '2025-01-16 11:30',
  },
  {
    id: 6,
    type: 'cambio',
    description: 'María García movida a Entrevista',
    actor: 'Ana Torres',
    timestamp: '2025-01-15 08:45',
  },
  {
    id: 7,
    type: 'evaluacion',
    description: 'Puntaje 92 registrado para Juan Pérez',
    actor: 'Ana Torres',
    timestamp: '2025-01-14 15:20',
  },
  {
    id: 8,
    type: 'rechazo',
    description: 'Pedro Sánchez rechazado del proceso',
    actor: 'Carlos Mendoza',
    timestamp: '2025-01-13 12:10',
  },
]

export function HistorialPage() {
  const [filter, setFilter] = useState('all')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const toast = useToast()

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedActivity(null)
  }

  const filteredActivities = useMemo(() => {
    if (filter === 'all') {
      return mockActivities
    }
    return mockActivities.filter((activity) => activity.type === filter)
  }, [filter])

  const handleExportClick = () => {
    setIsExportModalOpen(true)
  }

  const handleExportConfirm = () => {
    // Lógica para exportar a CSV
    const csvContent = [
      ['Tipo', 'Descripción', 'Actor', 'Fecha y Hora'],
      ...filteredActivities.map((activity) => [
        activity.type,
        activity.description,
        activity.actor,
        activity.timestamp,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `historial_actividad_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setIsExportModalOpen(false)
    toast.success('Archivo CSV exportado correctamente')
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Historial de Actividad</h1>
          <p className={styles.subtitle}>Registro de todas las acciones realizadas en el sistema</p>
        </div>
        <Button
          variant="secondary"
          onClick={handleExportClick}
          icon={Download}
          iconPosition="left"
          className={styles.exportButton}
        >
          Exportar CSV
        </Button>
      </div>

      {/* Filter */}
      <div className={styles.filterSection}>
        <ActivityFilter value={filter} onChange={handleFilterChange} />
      </div>

      {/* Activity List */}
      <div className={styles.listSection}>
        <ActivityList 
          activities={filteredActivities} 
          onActivityClick={handleActivityClick}
        />
      </div>

      {/* Detail Modal */}
      <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        activity={selectedActivity}
      />

      {/* Export Confirm Modal */}
      <ConfirmModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExportConfirm}
        title="Exportar Historial"
        message={`¿Estás seguro de que deseas exportar ${filteredActivities.length} actividad(es) a CSV?`}
        confirmText="Exportar"
        cancelText="Cancelar"
        type="info"
      />
    </div>
  )
}

