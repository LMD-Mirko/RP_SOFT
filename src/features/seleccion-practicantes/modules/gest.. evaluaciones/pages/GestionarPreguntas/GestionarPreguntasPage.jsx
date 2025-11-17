import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle, X } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import { Modal } from '@shared/components/Modal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { usePreguntas } from '../../hooks/usePreguntas'
import { Skeleton } from '../../../../shared/components/Skeleton'
import styles from './GestionarPreguntasPage.module.css'

export function GestionarPreguntasPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { preguntas, loading, loadPreguntas, createPregunta, updatePregunta, deletePregunta, createOpcionRespuesta, updateOpcionRespuesta, deleteOpcionRespuesta } = usePreguntas(id)
  const [evaluacion, setEvaluacion] = useState(null)
  const [isPreguntaModalOpen, setIsPreguntaModalOpen] = useState(false)
  const [isOpcionModalOpen, setIsOpcionModalOpen] = useState(false)
  const [selectedPregunta, setSelectedPregunta] = useState(null)
  const [selectedOpcion, setSelectedOpcion] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteType, setDeleteType] = useState(null) // 'pregunta' o 'opcion'
  const [formData, setFormData] = useState({
    text: '',
    question_type: 'multiple_choice',
    order: 0,
    points: 1,
  })
  const [opcionData, setOpcionData] = useState({
    text: '',
    is_correct: false,
    order: 0,
  })

  useEffect(() => {
    if (!id) return
    
    const loadData = async () => {
      await loadPreguntas()
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!id) return
    
    const fetchEvaluacion = async () => {
      try {
        const { getEvaluacionById } = await import('../../services/evaluacionService')
        const evalData = await getEvaluacionById(id)
        setEvaluacion(evalData)
      } catch (error) {
        console.error('Error al cargar evaluación:', error)
      }
    }
    fetchEvaluacion()
  }, [id])

  const handleNewPregunta = () => {
    setSelectedPregunta(null)
    setFormData({
      text: '',
      question_type: 'multiple_choice',
      order: preguntas.length + 1,
      points: 1,
    })
    setIsPreguntaModalOpen(true)
  }

  const handleEditPregunta = (pregunta) => {
    setSelectedPregunta(pregunta)
    setFormData({
      text: pregunta.text || '',
      question_type: pregunta.question_type || 'multiple_choice',
      order: pregunta.order || 0,
      points: pregunta.points || 1,
    })
    setIsPreguntaModalOpen(true)
  }

  const handleSavePregunta = async (e) => {
    e.preventDefault()
    try {
      if (selectedPregunta) {
        await updatePregunta(selectedPregunta.id, formData)
      } else {
        await createPregunta(formData)
      }
      setIsPreguntaModalOpen(false)
      setSelectedPregunta(null)
    } catch (error) {
      console.error('Error al guardar pregunta:', error)
    }
  }

  const handleDeletePregunta = (pregunta) => {
    setSelectedPregunta(pregunta)
    setDeleteType('pregunta')
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteType === 'pregunta' && selectedPregunta) {
      await deletePregunta(selectedPregunta.id)
    } else if (deleteType === 'opcion' && selectedPregunta && selectedOpcion) {
      await deleteOpcionRespuesta(selectedPregunta.id, selectedOpcion.id)
    }
    setIsDeleteModalOpen(false)
    setSelectedPregunta(null)
    setSelectedOpcion(null)
    setDeleteType(null)
  }

  const handleNewOpcion = (pregunta) => {
    setSelectedPregunta(pregunta)
    setSelectedOpcion(null)
    setOpcionData({
      text: '',
      is_correct: false,
      order: (pregunta.answer_options?.length || 0) + 1,
    })
    setIsOpcionModalOpen(true)
  }

  const handleEditOpcion = (pregunta, opcion) => {
    setSelectedPregunta(pregunta)
    setSelectedOpcion(opcion)
    setOpcionData({
      text: opcion.text || '',
      is_correct: opcion.is_correct || false,
      order: opcion.order || 0,
    })
    setIsOpcionModalOpen(true)
  }

  const handleSaveOpcion = async (e) => {
    e.preventDefault()
    if (!selectedPregunta) return

    try {
      if (selectedOpcion) {
        await updateOpcionRespuesta(selectedPregunta.id, selectedOpcion.id, opcionData)
      } else {
        await createOpcionRespuesta(selectedPregunta.id, opcionData)
      }
      setIsOpcionModalOpen(false)
      setSelectedPregunta(null)
      setSelectedOpcion(null)
    } catch (error) {
      console.error('Error al guardar opción:', error)
    }
  }

  const handleDeleteOpcion = (pregunta, opcion) => {
    setSelectedPregunta(pregunta)
    setSelectedOpcion(opcion)
    setDeleteType('opcion')
    setIsDeleteModalOpen(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate('/seleccion-practicantes/evaluaciones')}
            className={styles.backButton}
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
          <h1 className={styles.title}>
            {evaluacion ? `Preguntas: ${evaluacion.title || evaluacion._apiData?.title || 'Evaluación'}` : 'Gestionar Preguntas'}
          </h1>
          <p className={styles.subtitle}>Crea y gestiona las preguntas de la evaluación</p>
        </div>
        <Button variant="primary" onClick={handleNewPregunta}>
          <Plus size={18} />
          Nueva Pregunta
        </Button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={16} />
              </div>
            ))}
          </div>
        ) : preguntas.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay preguntas en esta evaluación. Crea la primera pregunta.</p>
          </div>
        ) : (
          <div className={styles.preguntasList}>
            {preguntas.map((pregunta, index) => (
              <div key={pregunta.id} className={styles.preguntaCard}>
                <div className={styles.preguntaHeader}>
                  <div className={styles.preguntaInfo}>
                    <span className={styles.preguntaNumber}>Pregunta {index + 1}</span>
                    <span className={styles.preguntaPoints}>{pregunta.points || 1} puntos</span>
                  </div>
                  <div className={styles.preguntaActions}>
                    <button
                      onClick={() => handleEditPregunta(pregunta)}
                      className={styles.actionButton}
                      title="Editar pregunta"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePregunta(pregunta)}
                      className={styles.actionButtonDelete}
                      title="Eliminar pregunta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className={styles.preguntaText}>{pregunta.text}</p>
                <div className={styles.opcionesSection}>
                  <div className={styles.opcionesHeader}>
                    <span className={styles.opcionesTitle}>Opciones de Respuesta</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleNewOpcion(pregunta)}
                    >
                      <Plus size={14} />
                      Agregar Opción
                    </Button>
                  </div>
                  {pregunta.answer_options && pregunta.answer_options.length > 0 ? (
                    <div className={styles.opcionesList}>
                      {pregunta.answer_options.map((opcion) => (
                        <div
                          key={opcion.id}
                          className={`${styles.opcionItem} ${opcion.is_correct ? styles.opcionCorrecta : ''}`}
                        >
                          <div className={styles.opcionContent}>
                            {opcion.is_correct && (
                              <CheckCircle size={16} className={styles.correctIcon} />
                            )}
                            <span className={styles.opcionText}>{opcion.text}</span>
                          </div>
                          <div className={styles.opcionActions}>
                            <button
                              onClick={() => handleEditOpcion(pregunta, opcion)}
                              className={styles.actionButton}
                              title="Editar opción"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteOpcion(pregunta, opcion)}
                              className={styles.actionButtonDelete}
                              title="Eliminar opción"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noOpciones}>No hay opciones de respuesta. Agrega al menos una.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Pregunta */}
      <Modal
        isOpen={isPreguntaModalOpen}
        onClose={() => {
          setIsPreguntaModalOpen(false)
          setSelectedPregunta(null)
        }}
        title={selectedPregunta ? 'Editar Pregunta' : 'Nueva Pregunta'}
        size="md"
      >
        <form onSubmit={handleSavePregunta} className={styles.form}>
          <Input
            label="Texto de la Pregunta"
            id="text"
            name="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Ingrese la pregunta..."
            required
            multiline
            rows={3}
          />
          <Select
            label="Tipo de Pregunta"
            id="question_type"
            name="question_type"
            value={formData.question_type}
            onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
            options={[
              { value: 'multiple_choice', label: 'Opción Múltiple' },
              { value: 'true_false', label: 'Verdadero/Falso' },
              { value: 'short_answer', label: 'Respuesta Corta' },
            ]}
            required
          />
          <div className={styles.formRow}>
            <Input
              label="Orden"
              id="order"
              name="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              min="0"
            />
            <Input
              label="Puntos"
              id="points"
              name="points"
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseFloat(e.target.value) || 1 })}
              min="0"
              step="0.5"
            />
          </div>
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsPreguntaModalOpen(false)
                setSelectedPregunta(null)
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {selectedPregunta ? 'Guardar Cambios' : 'Crear Pregunta'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Opción */}
      <Modal
        isOpen={isOpcionModalOpen}
        onClose={() => {
          setIsOpcionModalOpen(false)
          setSelectedPregunta(null)
          setSelectedOpcion(null)
        }}
        title={selectedOpcion ? 'Editar Opción' : 'Nueva Opción de Respuesta'}
        size="md"
      >
        <form onSubmit={handleSaveOpcion} className={styles.form}>
          <Input
            label="Texto de la Opción"
            id="opcionText"
            name="opcionText"
            value={opcionData.text}
            onChange={(e) => setOpcionData({ ...opcionData, text: e.target.value })}
            placeholder="Ingrese la opción de respuesta..."
            required
          />
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={opcionData.is_correct}
                onChange={(e) => setOpcionData({ ...opcionData, is_correct: e.target.checked })}
                className={styles.checkbox}
              />
              <span>Es la respuesta correcta</span>
            </label>
          </div>
          <Input
            label="Orden"
            id="opcionOrder"
            name="opcionOrder"
            type="number"
            value={opcionData.order}
            onChange={(e) => setOpcionData({ ...opcionData, order: parseInt(e.target.value) || 0 })}
            min="0"
          />
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsOpcionModalOpen(false)
                setSelectedPregunta(null)
                setSelectedOpcion(null)
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {selectedOpcion ? 'Guardar Cambios' : 'Crear Opción'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedPregunta(null)
          setSelectedOpcion(null)
          setDeleteType(null)
        }}
        onConfirm={handleConfirmDelete}
        title={deleteType === 'pregunta' ? 'Eliminar Pregunta' : 'Eliminar Opción'}
        message={
          deleteType === 'pregunta'
            ? `¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.`
            : `¿Estás seguro de que deseas eliminar esta opción de respuesta?`
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

