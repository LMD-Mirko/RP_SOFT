import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConvocatoriaCard } from '../components/ConvocatoriaCard'
import { ConvocatoriaModal } from '../components/ConvocatoriaModal'
import { useConvocatorias } from '../hooks/useConvocatorias'
import { SkeletonConvocatoriaCard } from '../../../shared/components/Skeleton'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './ConvocatoriasPage.module.css'

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY
 */
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Convierte datos de la API al formato esperado por los componentes
 */
const mapConvocatoriaFromAPI = (apiData) => {
  const startDate = apiData.start_date ? new Date(apiData.start_date) : null
  const endDate = apiData.end_date ? new Date(apiData.end_date) : null
  
  return {
    id: apiData.id,
    titulo: apiData.title || '',
    descripcion: apiData.description || '',
    fechaInicio: formatDate(apiData.start_date),
    fechaFin: formatDate(apiData.end_date),
    fechaInicioDate: startDate,
    fechaFinDate: endDate,
    cupos: apiData.cupos || 0,
    postulantes: apiData.postulantes_count || 0,
    estado: apiData.status || 'borrador',
    link: `${window.location.origin}/seleccion-practicantes/postulacion?convocatoria=${apiData.id}`,
    // Datos originales de la API
    _apiData: apiData,
  }
}

export function ConvocatoriasPage() {
  const navigate = useNavigate()
  const { convocatorias: apiConvocatorias, loading, createConvocatoria, updateConvocatoria } = useConvocatorias()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null)

  // Mapear convocatorias de la API al formato del componente
  const convocatorias = apiConvocatorias.map(mapConvocatoriaFromAPI)

  const handleNewConvocatoria = () => {
    setSelectedConvocatoria(null)
    setIsModalOpen(true)
  }

  const handleEdit = (convocatoria) => {
    setSelectedConvocatoria(convocatoria)
    setIsModalOpen(true)
  }

  const handleSave = async (formData) => {
    try {
      // Preparar datos para la API
      const apiData = {
        title: formData.titulo,
        description: formData.descripcion,
        start_date: formData.fechaInicio ? formData.fechaInicio.toISOString() : null,
        end_date: formData.fechaFin ? formData.fechaFin.toISOString() : null,
        status: formData.estado || 'borrador',
      }

      if (selectedConvocatoria) {
        // Editar convocatoria existente
        await updateConvocatoria(selectedConvocatoria.id, apiData)
      } else {
        // Crear nueva convocatoria
        await createConvocatoria(apiData)
      }
      
      setIsModalOpen(false)
      setSelectedConvocatoria(null)
    } catch (error) {
      console.error('Error al guardar convocatoria:', error)
      // El error ya se maneja en el hook con toast
    }
  }

  const handleViewApplicants = (convocatoria) => {
    navigate(`/seleccion-practicantes/postulantes?convocatoria=${convocatoria.id}`)
  }

  const handleManageEvaluations = (convocatoria) => {
    navigate(`/seleccion-practicantes/convocatorias/${convocatoria.id}/encuestas`)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Convocatorias</h1>
          <p className={styles.subtitle}>Gestiona los procesos de reclutamiento</p>
        </div>
        <button onClick={handleNewConvocatoria} className={styles.buttonPrimary}>
          <Plus size={20} />
          Nueva Convocatoria
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.grid}>
            <SkeletonConvocatoriaCard index={0} />
            <SkeletonConvocatoriaCard index={1} />
            <SkeletonConvocatoriaCard index={2} />
          </div>
        ) : convocatorias.length === 0 ? (
          <EmptyState
            iconPreset="folder"
            colorPreset="dark"
            iconColor="#0f172a"
            title="No hay convocatorias creadas"
            description="Crea tu primera convocatoria para comenzar a reclutar."
            className={styles.emptyState}
          >
            <button onClick={handleNewConvocatoria} className={styles.buttonPrimary}>
              <Plus size={20} />
              Crear Primera Convocatoria
            </button>
          </EmptyState>
        ) : (
          <div className={styles.grid}>
            {convocatorias.map((convocatoria, index) => (
              <ConvocatoriaCard
                key={convocatoria.id}
                convocatoria={convocatoria}
                onEdit={handleEdit}
                onViewApplicants={handleViewApplicants}
                onManageEvaluations={handleManageEvaluations}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ConvocatoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        convocatoria={selectedConvocatoria}
      />
    </div>
  )
}

