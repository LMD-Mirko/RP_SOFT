import { useState } from 'react'
import { Edit, Trash2, Award } from 'lucide-react'
import { Table } from '@shared/components/UI/Table'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import { Button } from '@shared/components/Button'
import { EvaluacionModal } from '../components/EvaluacionModal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { useToast } from '@shared/components/Toast'
import styles from './EvaluacionesPage.module.css'

// Datos mock para demostración
const mockEvaluaciones = [
  {
    id: 1,
    postulante: 'Juan Pérez',
    prueba: 'Prueba Técnica',
    puntaje: null,
    estado: 'pendiente',
  },
  {
    id: 2,
    postulante: 'María García',
    prueba: 'Entrevista',
    puntaje: 85,
    estado: 'completada',
  },
  {
    id: 3,
    postulante: 'Carlos López',
    prueba: 'Evaluación Psicológica',
    puntaje: 92,
    estado: 'completada',
  },
  {
    id: 4,
    postulante: 'Ana Ramírez',
    prueba: 'Prueba Técnica',
    puntaje: null,
    estado: 'pendiente',
  },
]

// Lista de postulantes para el select
const mockPostulantes = [
  { value: '1', label: 'Juan Pérez' },
  { value: '2', label: 'María García' },
  { value: '3', label: 'Carlos López' },
  { value: '4', label: 'Ana Ramírez' },
  { value: '5', label: 'Pedro Sánchez' },
]

export function EvaluacionesPage() {
  const [evaluaciones, setEvaluaciones] = useState(mockEvaluaciones)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null)
  const [evaluacionToDelete, setEvaluacionToDelete] = useState(null)
  const [formData, setFormData] = useState({
    postulante: '',
    puntaje: '',
  })
  const toast = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Crear nueva evaluación desde el formulario lateral
    const newEvaluacion = {
      id: Date.now(),
      postulante: formData.postulante,
      prueba: 'Evaluación General',
      puntaje: parseInt(formData.puntaje),
      estado: parseInt(formData.puntaje) > 0 ? 'completada' : 'pendiente',
    }
    setEvaluaciones(prev => [newEvaluacion, ...prev])
    toast.success('Evaluación creada correctamente')
    
    // Reset form
    setFormData({
      postulante: '',
      puntaje: '',
    })
  }

  const handleSaveFromModal = (formData) => {
    if (formData.id) {
      // Editar evaluación existente
      setEvaluaciones(prev =>
        prev.map(ev =>
          ev.id === formData.id
            ? {
                ...ev,
                postulante: formData.postulante,
                prueba: formData.prueba,
                puntaje: parseInt(formData.puntaje),
                estado: parseInt(formData.puntaje) > 0 ? 'completada' : 'pendiente',
              }
            : ev
        )
      )
      toast.success('Evaluación actualizada correctamente')
    }
    setSelectedEvaluacion(null)
  }

  const handleEdit = (evaluacion) => {
    setSelectedEvaluacion(evaluacion)
    setIsModalOpen(true)
  }

  const handleDelete = (evaluacion) => {
    setEvaluacionToDelete(evaluacion)
    setIsConfirmModalOpen(true)
  }

  const confirmDelete = () => {
    if (evaluacionToDelete) {
      setEvaluaciones(prev => prev.filter(ev => ev.id !== evaluacionToDelete.id))
      toast.success('Evaluación eliminada correctamente')
      setEvaluacionToDelete(null)
    }
    setIsConfirmModalOpen(false)
  }

  const getEstadoBadge = (estado) => {
    if (estado === 'completada') {
      return <span className={styles.badgeCompleted}>Completado</span>
    }
    return <span className={styles.badgePending}>Pendiente</span>
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Evaluaciones</h1>
          <p className={styles.subtitle}>Registra y gestiona evaluaciones técnicas y psicológicas</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Tabla de Evaluaciones */}
        <div className={styles.tableSection}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Postulante</Table.HeaderCell>
                <Table.HeaderCell>Prueba</Table.HeaderCell>
                <Table.HeaderCell align="center">Puntaje</Table.HeaderCell>
                <Table.HeaderCell align="center">Estado</Table.HeaderCell>
                <Table.HeaderCell align="center" width="120px">Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {evaluaciones.length > 0 ? (
                evaluaciones.map((evaluacion) => (
                  <Table.Row key={evaluacion.id}>
                    <Table.Cell>
                      <span className={styles.postulanteNombre}>{evaluacion.postulante}</span>
                    </Table.Cell>
                    <Table.Cell>{evaluacion.prueba}</Table.Cell>
                    <Table.Cell align="center">
                      {evaluacion.puntaje !== null ? (
                        <span className={styles.puntaje}>{evaluacion.puntaje}</span>
                      ) : (
                        <span className={styles.puntajeEmpty}>-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getEstadoBadge(evaluacion.estado)}
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEdit(evaluacion)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(evaluacion)}
                          className={styles.actionButtonDelete}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Empty colSpan={5} icon={Award}>
                  No hay evaluaciones registradas
                </Table.Empty>
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Formulario de Evaluación */}
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Select
              label="Postulante"
              id="postulante"
              name="postulante"
              value={formData.postulante}
              onChange={handleChange}
              options={mockPostulantes}
              placeholder="Seleccionar postulante"
              required
            />

            <Input
              label="Puntaje"
              type="number"
              id="puntaje"
              name="puntaje"
              value={formData.puntaje}
              onChange={handleChange}
              placeholder="0-100"
              min="0"
              max="100"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              Guardar Evaluación
            </Button>
          </form>
        </div>
      </div>

      {/* Modal de Edición */}
      <EvaluacionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvaluacion(null)
        }}
        onSave={handleSaveFromModal}
        evaluacion={selectedEvaluacion}
        postulantes={mockPostulantes}
      />

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setEvaluacionToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Eliminar Evaluación"
        message={
          evaluacionToDelete
            ? `¿Seguro que deseas eliminar la evaluación de ${evaluacionToDelete.postulante}?`
            : '¿Seguro que deseas eliminar esta evaluación?'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

