import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ConvocatoriaCard } from '../components/ConvocatoriaCard'
import { ConvocatoriaModal } from '../components/ConvocatoriaModal'
import styles from './ConvocatoriasPage.module.css'

// Datos de ejemplo
const convocatoriasData = [
  {
    id: 1,
    titulo: 'Convocatoria Enero 2024',
    descripcion: 'Proceso de selección para practicantes de desarrollo web',
    fechaInicio: '09/01/2025',
    fechaFin: '30/01/2025',
    fechaInicioDate: new Date(2025, 0, 9),
    fechaFinDate: new Date(2025, 0, 30),
    cupos: 10,
    postulantes: 15,
    estado: 'activa',
    link: 'https://rpsoft.com/postulacion/enero-2025',
  },
]

export function ConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState(convocatoriasData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null)

  const handleNewConvocatoria = () => {
    setSelectedConvocatoria(null)
    setIsModalOpen(true)
  }

  const handleEdit = (convocatoria) => {
    setSelectedConvocatoria(convocatoria)
    setIsModalOpen(true)
  }

  const handleSave = (formData) => {
    const formatDate = (date) => {
      if (!date) return ''
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }

    const convocatoriaData = {
      ...formData,
      fechaInicio: formatDate(formData.fechaInicio),
      fechaFin: formatDate(formData.fechaFin),
      fechaInicioDate: formData.fechaInicio,
      fechaFinDate: formData.fechaFin,
    }

    if (selectedConvocatoria) {
      // Editar convocatoria existente
      setConvocatorias(prev =>
        prev.map(c =>
          c.id === selectedConvocatoria.id
            ? { ...c, ...convocatoriaData }
            : c
        )
      )
    } else {
      // Crear nueva convocatoria
      const newConvocatoria = {
        id: Date.now(),
        ...convocatoriaData,
        postulantes: 0,
        link: `https://rpsoft.com/postulacion/${formData.titulo.toLowerCase().replace(/\s+/g, '-')}`,
      }
      setConvocatorias(prev => [...prev, newConvocatoria])
    }
  }

  const handleViewApplicants = (convocatoria) => {
    console.log('Ver postulantes de:', convocatoria.titulo)
    // Aquí navegarás a la página de postulantes
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
        {convocatorias.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No hay convocatorias creadas</p>
            <button onClick={handleNewConvocatoria} className={styles.buttonPrimary}>
              <Plus size={20} />
              Crear Primera Convocatoria
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {convocatorias.map((convocatoria, index) => (
              <ConvocatoriaCard
                key={convocatoria.id}
                convocatoria={convocatoria}
                onEdit={handleEdit}
                onViewApplicants={handleViewApplicants}
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

