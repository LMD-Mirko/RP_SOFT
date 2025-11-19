import { ArrowLeft, Plus, Loader2, FileJson } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PreguntaCard } from '../components/PreguntaCard'
import { QuestionModal } from '../components/QuestionModal'
import { OptionModal } from '../components/OptionModal'
import { CreateEvaluationFromJsonModal } from '../components/CreateEvaluationFromJsonModal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import {
  getEvaluacionByType,
  getConvocatoriaById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createOption,
  updateOption,
  deleteOption,
} from '../services/convocatoriaService'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EmptyState } from '@shared/components/EmptyState'
import { Button } from '@shared/components/Button'
import styles from './GestionPreguntasPage.module.css'

const EVALUATION_TITLES = {
  profile: 'Encuesta de Perfil',
  technical: 'Evaluación Técnica',
  psychological: 'Evaluación Psicológica',
  motivation: 'Evaluación de Motivación',
}

export function GestionPreguntasPage() {
  const { jobPostingId, evaluationType } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [convocatoria, setConvocatoria] = useState(null)
  const [evaluacion, setEvaluacion] = useState(null)
  const [preguntas, setPreguntas] = useState([])

  // Modales
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [optionModalOpen, setOptionModalOpen] = useState(false)
  const [deleteQuestionModalOpen, setDeleteQuestionModalOpen] = useState(false)
  const [deleteOptionModalOpen, setDeleteOptionModalOpen] = useState(false)
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false)

  // Estados para edición
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedQuestionForOption, setSelectedQuestionForOption] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteOptionQuestion, setDeleteOptionQuestion] = useState(null)

  useEffect(() => {
    loadData()
  }, [jobPostingId, evaluationType])

  const loadData = async () => {
    if (!jobPostingId || !evaluationType) return

    try {
      setLoading(true)
      const [convocatoriaData, evaluacionData] = await Promise.all([
        getConvocatoriaById(jobPostingId),
        getEvaluacionByType(jobPostingId, evaluationType),
      ])

      setConvocatoria(convocatoriaData)
      setEvaluacion(evaluacionData.evaluation)
      setPreguntas(evaluacionData.questions || [])
    } catch (error) {
      console.error('Error al cargar datos:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al cargar las preguntas'
      toast.error(errorMessage)

      if (error.response?.status === 404) {
        setTimeout(() => {
          navigate(`/seleccion-practicantes/convocatorias/${jobPostingId}/encuestas`)
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuestion = () => {
    setSelectedQuestion(null)
    setQuestionModalOpen(true)
  }

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question)
    setQuestionModalOpen(true)
  }

  const handleSaveQuestion = async (data) => {
    if (!evaluacion?.id) {
      toast.error('No se pudo obtener el ID de la evaluación')
      return
    }

    try {
      setIsSaving(true)
      if (selectedQuestion) {
        // Editar
        await updateQuestion(selectedQuestion.id, data)
        toast.success('Pregunta actualizada exitosamente')
      } else {
        // Crear
        const newQuestion = await createQuestion(evaluacion.id, data)
        toast.success('Pregunta creada exitosamente')
        setQuestionModalOpen(false)
        // Recargar datos para obtener la pregunta completa
        await loadData()
        // Buscar la pregunta recién creada en la lista actualizada
        const updatedPreguntas = await getEvaluacionByType(jobPostingId, evaluationType)
        const createdQuestion = updatedPreguntas.questions?.find((q) => q.id === newQuestion.id)
        if (createdQuestion) {
          setSelectedQuestionForOption(createdQuestion)
          setOptionModalOpen(true)
        }
        return
      }
      setQuestionModalOpen(false)
      await loadData()
    } catch (error) {
      console.error('Error al guardar pregunta:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al guardar la pregunta'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return

    try {
      setIsSaving(true)
      await deleteQuestion(selectedQuestion.id)
      toast.success('Pregunta eliminada exitosamente')
      setDeleteQuestionModalOpen(false)
      setSelectedQuestion(null)
      await loadData()
    } catch (error) {
      console.error('Error al eliminar pregunta:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al eliminar la pregunta'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddOption = (question) => {
    setSelectedQuestionForOption(question)
    setSelectedOption(null)
    setOptionModalOpen(true)
  }

  const handleEditOption = (question, option) => {
    setSelectedQuestionForOption(question)
    setSelectedOption(option)
    setOptionModalOpen(true)
  }

  const handleSaveOption = async (data) => {
    if (!selectedQuestionForOption?.id) {
      toast.error('No se pudo obtener el ID de la pregunta')
      return
    }

    try {
      setIsSaving(true)
      if (selectedOption) {
        // Editar
        await updateOption(selectedOption.id, data)
        toast.success('Opción actualizada exitosamente')
        setOptionModalOpen(false)
        setSelectedOption(null)
        await loadData()
      } else {
        // Crear
        await createOption(selectedQuestionForOption.id, data)
        toast.success('Opción agregada exitosamente')
        // Recargar datos para actualizar las opciones en el modal
        await loadData()
        // Actualizar la pregunta seleccionada con las nuevas opciones
        const updatedPreguntas = await getEvaluacionByType(jobPostingId, evaluationType)
        const updatedQuestion = updatedPreguntas.questions?.find(
          (q) => q.id === selectedQuestionForOption.id
        )
        if (updatedQuestion) {
          setSelectedQuestionForOption(updatedQuestion)
        }
        // No cerrar el modal, permitir agregar más
      }
    } catch (error) {
      console.error('Error al guardar opción:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al guardar la opción'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFinishOptions = () => {
    setOptionModalOpen(false)
    setSelectedQuestionForOption(null)
    setSelectedOption(null)
    loadData()
  }

  const handleDeleteOptionClick = (question, option) => {
    setDeleteOptionQuestion(question)
    setSelectedOption(option)
    setDeleteOptionModalOpen(true)
  }

  const handleDeleteOption = async () => {
    if (!selectedOption) return

    try {
      setIsSaving(true)
      await deleteOption(selectedOption.id)
      toast.success('Opción eliminada exitosamente')
      setDeleteOptionModalOpen(false)
      setSelectedOption(null)
      setDeleteOptionQuestion(null)
      await loadData()
    } catch (error) {
      console.error('Error al eliminar opción:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al eliminar la opción'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    navigate(`/seleccion-practicantes/convocatorias/${jobPostingId}/encuestas`)
  }

  const handleOpenJsonModal = () => {
    setIsJsonModalOpen(true)
  }

  const handleJsonModalSuccess = () => {
    // Recargar datos después de crear la evaluación
    loadData()
  }

  const handleCloseJsonModal = () => {
    setIsJsonModalOpen(false)
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={300} height={20} />
        </div>
        <div className={styles.content}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={200} />
          ))}
        </div>
      </div>
    )
  }

  if (!evaluacion) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Evaluación no encontrada"
          message="La evaluación que buscas no existe o fue eliminada."
          actionLabel="Volver a Encuestas"
          onAction={handleBack}
        />
      </div>
    )
  }

  const evaluationTitle = EVALUATION_TITLES[evaluationType] || 'Evaluación'

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft size={20} />
            Volver
          </button>
          <div>
            <h1 className={styles.title}>{evaluationTitle}</h1>
            <p className={styles.subtitle}>
              {evaluacion.description || `Gestiona las preguntas de esta evaluación`}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleOpenJsonModal} className={styles.jsonButton}>
            <FileJson size={18} />
            Crear desde JSON
          </button>
          <Button onClick={handleCreateQuestion} icon={Plus} variant="primary">
            Crear Nueva Pregunta
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {preguntas.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No hay preguntas configuradas</p>
            <Button onClick={handleCreateQuestion} icon={Plus} variant="primary">
              Crear Primera Pregunta
            </Button>
          </div>
        ) : (
          <div className={styles.questionsList}>
            {preguntas
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((pregunta, index) => (
                <PreguntaCard
                  key={pregunta.id}
                  pregunta={pregunta}
                  onEdit={handleEditQuestion}
                  onDelete={(p) => {
                    setSelectedQuestion(p)
                    setDeleteQuestionModalOpen(true)
                  }}
                  onAddOption={handleAddOption}
                  onEditOption={handleEditOption}
                  onDeleteOption={handleDeleteOptionClick}
                  index={index}
                />
              ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <QuestionModal
        isOpen={questionModalOpen}
        onClose={() => {
          setQuestionModalOpen(false)
          setSelectedQuestion(null)
        }}
        onSave={handleSaveQuestion}
        question={selectedQuestion}
        existingQuestions={preguntas}
        isLoading={isSaving}
      />

      <OptionModal
        isOpen={optionModalOpen}
        onClose={() => {
          setOptionModalOpen(false)
          setSelectedQuestionForOption(null)
          setSelectedOption(null)
        }}
        onAdd={handleSaveOption}
        onFinish={handleFinishOptions}
        question={selectedQuestionForOption}
        option={selectedOption}
        optionsCount={selectedQuestionForOption?.options?.length || 0}
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={deleteQuestionModalOpen}
        onClose={() => {
          setDeleteQuestionModalOpen(false)
          setSelectedQuestion(null)
        }}
        onConfirm={handleDeleteQuestion}
        title="Eliminar Pregunta"
        message="¿Estás seguro de eliminar esta pregunta? Esto también eliminará todas sus opciones."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={deleteOptionModalOpen}
        onClose={() => {
          setDeleteOptionModalOpen(false)
          setSelectedOption(null)
          setDeleteOptionQuestion(null)
        }}
        onConfirm={handleDeleteOption}
        title="Eliminar Opción"
        message="¿Estás seguro de eliminar esta opción?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isSaving}
      />

      {/* JSON Modal */}
      <CreateEvaluationFromJsonModal
        isOpen={isJsonModalOpen}
        onClose={handleCloseJsonModal}
        jobPostingId={parseInt(jobPostingId)}
        evaluationType={evaluationType}
        onSuccess={handleJsonModalSuccess}
      />
    </div>
  )
}

