import { useState, useEffect } from 'react'
import { Download, Trash2 } from 'lucide-react'
import { ActivityFilter } from '../components/ActivityFilter'
import { ActivityList } from '../components/ActivityList'
import { ActivityDetailModal } from '../components/ActivityDetailModal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import { useHistorial } from '../hooks/useHistorial'
import { SkeletonList } from '../../../shared/components/Skeleton'
import styles from './HistorialPage.module.css'

export function HistorialPage() {
  const [filter, setFilter] = useState('all')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const toast = useToast()
  const { loading, actividades, pagination, loadActividades, limpiarHistorial } = useHistorial()

  // Cargar actividades al montar el componente y cuando cambia el filtro
  useEffect(() => {
    loadActividades({ type: filter !== 'all' ? filter : undefined })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

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

  const handleClearClick = () => {
    setIsClearModalOpen(true)
  }

  const handleClearConfirm = async () => {
    try {
      await limpiarHistorial()
      setIsClearModalOpen(false)
    } catch (error) {
      // El error ya se maneja en el hook
    }
  }

  const handleExportClick = () => {
    setIsExportModalOpen(true)
  }

  const handleExportConfirm = () => {
    // Lógica para exportar a CSV
    const csvContent = [
      ['Tipo', 'Descripción', 'Actor', 'Fecha y Hora'],
      ...actividades.map((activity) => [
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
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            onClick={handleExportClick}
            icon={Download}
            iconPosition="left"
            className={styles.exportButton}
            disabled={loading || !actividades || actividades.length === 0}
          >
            Exportar CSV
          </Button>
          <Button
            variant="danger"
            onClick={handleClearClick}
            icon={Trash2}
            iconPosition="left"
            className={styles.clearButton}
            disabled={loading || !actividades || actividades.length === 0}
          >
            Limpiar Historial
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className={styles.filterSection}>
        <ActivityFilter value={filter} onChange={handleFilterChange} />
      </div>

      {/* Activity List */}
      <div className={styles.listSection}>
        {loading ? (
          <SkeletonList items={8} />
        ) : (
          <ActivityList 
            activities={actividades} 
            onActivityClick={handleActivityClick}
          />
        )}
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
        message={`¿Estás seguro de que deseas exportar ${actividades.length} actividad(es) a CSV?`}
        confirmText="Exportar"
        cancelText="Cancelar"
        type="info"
      />

      {/* Clear Confirm Modal */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearConfirm}
        title="Limpiar Historial"
        message="¿Estás seguro de que deseas eliminar todo el historial? Esta acción es irreversible y eliminará todos los registros de actividad."
        confirmText="Limpiar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

