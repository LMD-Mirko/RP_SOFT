import { Plus, FileText, Settings, Trash2, Users, FileJson, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExamenes } from '../hooks/useExamenes'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Button } from '@shared/components/Button'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { useToast } from '@shared/components/Toast'
import { ExamModal } from '../components/ExamModal'
import { CreateExamFromJsonModal } from '../components/CreateExamFromJsonModal'
import { AssignExamModal } from '../components/AssignExamModal'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './ExamenesPage.module.css'

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function ExamenesPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { examenes, loading, createExam: createExamFromHook, updateExam: updateExamFromHook, deleteExam: deleteExamFromHook, loadExamenes } = useExamenes()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExamModalOpen, setIsExamModalOpen] = useState(false)
  const [isCreateJsonModalOpen, setIsCreateJsonModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [examToAssign, setExamToAssign] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleCreateExam = () => {
    setSelectedExam(null)
    setIsExamModalOpen(true)
  }

  const handleCreateFromJson = () => {
    setIsCreateJsonModalOpen(true)
  }

  const handleEditExam = (exam) => {
    setSelectedExam(exam)
    setIsExamModalOpen(true)
  }

  const handleSaveExam = async (data) => {
    try {
      setIsSaving(true)
      if (selectedExam) {
        await updateExamFromHook(selectedExam.id, data)
      } else {
        await createExamFromHook(data)
      }
      setIsExamModalOpen(false)
      setSelectedExam(null)
      if (loadExamenes) {
        await loadExamenes(1)
      }
    } catch (error) {
      console.error('Error al guardar examen:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateJsonSuccess = async () => {
    setIsCreateJsonModalOpen(false)
    if (loadExamenes) {
      await loadExamenes(1)
    }
  }

  const handleAssignClick = (exam) => {
    setExamToAssign(exam)
    setIsAssignModalOpen(true)
  }

  const handleViewParticipants = (exam) => {
    navigate(`/seleccion-practicantes/examenes/${exam.id}/participantes`)
  }

  const handleAssignSuccess = () => {
    setIsAssignModalOpen(false)
    setExamToAssign(null)
  }

  const handleManageQuestions = (exam) => {
    navigate(`/seleccion-practicantes/examenes/${exam.id}/gestionar`)
  }

  const handleDeleteClick = (exam) => {
    setSelectedExam(exam)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedExam) return

    try {
      setIsDeleting(true)
      await deleteExamFromHook(selectedExam.id)
      setDeleteModalOpen(false)
      setSelectedExam(null)
      if (loadExamenes) {
        await loadExamenes(1)
      }
    } catch (error) {
      console.error('Error al eliminar examen:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={150} height={40} />
        </div>
        <div className={styles.content}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={150} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Exámenes</h1>
          <p className={styles.subtitle}>Gestiona todos los exámenes del sistema</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleCreateFromJson} className={styles.jsonButton}>
            <FileJson size={18} />
            Crear desde JSON
          </button>
          <Button onClick={handleCreateExam} icon={Plus} variant="primary">
            Crear Examen
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {examenes.length === 0 ? (
          <EmptyState
            iconPreset="list"
            colorPreset="dark"
            iconColor="#0f172a"
            title="No hay exámenes creados"
            description="Registra tu primer examen o impórtalo desde un archivo JSON."
            className={styles.emptyState}
          >
            <div className={styles.emptyActions}>
              <Button onClick={handleCreateExam} icon={Plus} variant="primary">
                Crear Primer Examen
              </Button>
              <button onClick={handleCreateFromJson} className={styles.jsonButton}>
                <FileJson size={18} />
                Crear desde JSON
              </button>
            </div>
          </EmptyState>
        ) : (
          <div className={styles.examsList}>
            {examenes.map((exam) => (
              <div key={exam.id} className={styles.examCard}>
                <div className={styles.examHeader}>
                  <div className={styles.examInfo}>
                    <h3 className={styles.examTitle}>{exam.title}</h3>
                    <p className={styles.examDescription}>{exam.description || 'Sin descripción'}</p>
                  </div>
                  <div className={styles.examStatus}>
                    {exam.is_active ? (
                      <div className={styles.statusContainer}>
                        <span className={styles.statusActive}>Activo</span>
                        <button
                          onClick={() => handleViewParticipants(exam)}
                          className={styles.participantsButton}
                          title="Ver participantes"
                        >
                          <UserCheck size={16} />
                          Ver participantes
                        </button>
                      </div>
                    ) : (
                      <span className={styles.statusInactive}>Inactivo</span>
                    )}
                  </div>
                </div>

                <div className={styles.examDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Fecha Inicio:</span>
                    <span className={styles.detailValue}>{formatDate(exam.start_date)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Fecha Fin:</span>
                    <span className={styles.detailValue}>{formatDate(exam.end_date)}</span>
                  </div>
                  {exam.time_limit_minutes && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Tiempo Límite:</span>
                      <span className={styles.detailValue}>{exam.time_limit_minutes} minutos</span>
                    </div>
                  )}
                  {exam.passing_score && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Nota Mínima:</span>
                      <span className={styles.detailValue}>{exam.passing_score} / 20</span>
                    </div>
                  )}
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Intentos Máximos:</span>
                    <span className={styles.detailValue}>{exam.max_attempts || 'Ilimitados'}</span>
                  </div>
                </div>

                <div className={styles.examActions}>
                  <button
                    onClick={() => handleManageQuestions(exam)}
                    className={styles.actionButton}
                    title="Gestionar Preguntas"
                  >
                    <FileText size={18} />
                    Gestionar Preguntas
                  </button>
                  <button
                    onClick={() => handleAssignClick(exam)}
                    className={styles.actionButton}
                    title="Asignar a Usuarios"
                  >
                    <Users size={18} />
                    Asignar
                  </button>
                  <button
                    onClick={() => handleEditExam(exam)}
                    className={styles.actionButton}
                    title="Editar"
                  >
                    <Settings size={18} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(exam)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedExam(null)
        }}
        onConfirm={handleDelete}
        title="Eliminar Examen"
        message={`¿Estás seguro de eliminar el examen "${selectedExam?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => {
          setIsExamModalOpen(false)
          setSelectedExam(null)
        }}
        onSave={handleSaveExam}
        exam={selectedExam}
        isLoading={isSaving}
      />

      <CreateExamFromJsonModal
        isOpen={isCreateJsonModalOpen}
        onClose={() => setIsCreateJsonModalOpen(false)}
        onSuccess={handleCreateJsonSuccess}
      />

      <AssignExamModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setExamToAssign(null)
        }}
        examId={examToAssign?.id}
        onSuccess={handleAssignSuccess}
      />
    </div>
  )
}

