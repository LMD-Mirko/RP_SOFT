import { ArrowLeft, Plus, FileJson } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PreguntaCard } from '../components/PreguntaCard'
import { QuestionModal } from '../components/QuestionModal'
import { OptionModal } from '../components/OptionModal'
import { CreateQuestionsFromJsonModal } from '../components/CreateQuestionsFromJsonModal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import {
  getExamById,
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  createOption,
  updateOption,
  deleteOption,
} from '../services'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EmptyState } from '@shared/components/EmptyState'
import { Button } from '@shared/components/Button'
import styles from './GestionExamenPage.module.css'

export function GestionExamenPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [examen, setExamen] = useState(null)
  const [preguntas, setPreguntas] = useState([])

  // Modales
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [optionModalOpen, setOptionModalOpen] = useState(false)
  const [deleteQuestionModalOpen, setDeleteQuestionModalOpen] = useState(false)
  const [deleteOptionModalOpen, setDeleteOptionModalOpen] = useState(false)
  const [createQuestionsJsonModalOpen, setCreateQuestionsJsonModalOpen] = useState(false)

  // Estados para edición
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedQuestionForOption, setSelectedQuestionForOption] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteOptionQuestion, setDeleteOptionQuestion] = useState(null)
  const isLoadingRef = useRef(false)

  const loadData = useCallback(async () => {
    if (!examId || isLoadingRef.current) return

    try {
      isLoadingRef.current = true
      setLoading(true)
      const examData = await getExamById(examId)

      setExamen(examData)
      setPreguntas(examData.questions || [])
    } catch (error) {
      console.error('Error al cargar datos:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al cargar el examen'
      toast.error(errorMessage)

      if (error.response?.status === 404) {
        setTimeout(() => {
          navigate('/seleccion-practicantes/examenes')
        }, 2000)
      }
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId])

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId])

  const handleCreateQuestion = () => {
    setSelectedQuestion(null)
    setQuestionModalOpen(true)
  }

  const handleCreateQuestionsFromJson = () => {
    setCreateQuestionsJsonModalOpen(true)
  }

  const handleCreateQuestionsJsonSuccess = () => {
    setCreateQuestionsJsonModalOpen(false)
    loadData()
  }

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question)
    setQuestionModalOpen(true)
  }

  const handleSaveQuestion = async (data) => {
    if (!examen?.id) {
      toast.error('No se pudo obtener el ID del examen')
      return
    }

    try {
      setIsSaving(true)
      if (selectedQuestion) {
        // Editar - usar solo questionId según la guía
        await updateQuestion(selectedQuestion.id, data)
        toast.success('Pregunta actualizada exitosamente')
        setQuestionModalOpen(false)
        await loadData()
      } else {
        // Crear
        const newQuestion = await createQuestion(examen.id, data)
        toast.success('Pregunta creada exitosamente')
        setQuestionModalOpen(false)
        // Recargar datos para obtener la pregunta completa
        await loadData()
        // Buscar la pregunta recién creada en la lista actualizada
        const updatedExam = await getExamById(examId)
        const createdQuestion = updatedExam.questions?.find((q) => q.id === newQuestion.id)
        if (createdQuestion) {
          setSelectedQuestionForOption(createdQuestion)
          setOptionModalOpen(true)
        }
        return
      }
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
    if (!selectedQuestion || !examen?.id) return

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
    if (!selectedQuestionForOption?.id || !examen?.id) {
      toast.error('No se pudo obtener el ID de la pregunta')
      return
    }

    try {
      setIsSaving(true)
      if (selectedOption) {
        // Editar - usar solo optionId según la guía
        await updateOption(selectedOption.id, data)
        toast.success('Opción actualizada exitosamente')
        setOptionModalOpen(false)
        setSelectedOption(null)
        await loadData()
      } else {
        // Crear - usar solo questionId según la guía
        await createOption(selectedQuestionForOption.id, data)
        toast.success('Opción agregada exitosamente')
        // Recargar datos para actualizar las opciones en el modal
        await loadData()
        // Actualizar la pregunta seleccionada con las nuevas opciones
        const updatedExam = await getExamById(examId)
        const updatedQuestion = updatedExam.questions?.find(
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
    if (!selectedOption || !deleteOptionQuestion) {
      toast.error('No se pudo obtener la información necesaria para eliminar la opción')
      return
    }

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
    navigate('/seleccion-practicantes/examenes')
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

  if (!examen) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Examen no encontrado"
          message="El examen que buscas no existe o fue eliminado."
          actionLabel="Volver a Exámenes"
          onAction={handleBack}
        />
      </div>
    )
  }

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
            <h1 className={styles.title}>{examen.title}</h1>
            <p className={styles.subtitle}>
              {examen.description || `Gestiona las preguntas de este examen`}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleCreateQuestionsFromJson} className={styles.jsonButton}>
            <FileJson size={18} />
            Crear con JSON
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
        optionsCount={selectedQuestionForOption?.options?.length || selectedQuestionForOption?.answer_options?.length || 0}
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

      <CreateQuestionsFromJsonModal
        isOpen={createQuestionsJsonModalOpen}
        onClose={() => setCreateQuestionsJsonModalOpen(false)}
        onSuccess={handleCreateQuestionsJsonSuccess}
        examId={examId}
      />
    </div>
  )
}

