import { ArrowLeft, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EvaluacionCard } from '../components/EvaluacionCard'
import { getEvaluacionesAll, getConvocatoriaById } from '../services/convocatoriaService'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './GestionEncuestasPage.module.css'

export function GestionEncuestasPage() {
  const { jobPostingId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [convocatoria, setConvocatoria] = useState(null)
  const [evaluaciones, setEvaluaciones] = useState({
    profile: null,
    technical: null,
    psychological: null,
    motivation: null,
  })

  useEffect(() => {
    loadData()
  }, [jobPostingId])

  const loadData = async () => {
    if (!jobPostingId) return

    try {
      setLoading(true)
      const [convocatoriaData, evaluacionesData] = await Promise.all([
        getConvocatoriaById(jobPostingId),
        getEvaluacionesAll(jobPostingId, false),
      ])

      setConvocatoria(convocatoriaData)
      setEvaluaciones(evaluacionesData.evaluations || {})
    } catch (error) {
      console.error('Error al cargar datos:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al cargar las encuestas'
      toast.error(errorMessage)

      if (error.response?.status === 404) {
        setTimeout(() => {
          navigate('/seleccion-practicantes/convocatorias')
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleManageQuestions = (evaluationType) => {
    navigate(`/seleccion-practicantes/convocatorias/${jobPostingId}/encuestas/${evaluationType}`)
  }

  const handleBack = () => {
    navigate('/seleccion-practicantes/convocatorias')
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.skeletonTitle}>
              <Skeleton variant="text" width={300} height={32} />
            </div>
            <div className={styles.skeletonSubtitle}>
              <Skeleton variant="text" width={400} height={20} />
            </div>
          </div>
        </div>
        <div className={styles.grid}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton variant="rectangular" width="100%" height={280} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!convocatoria) {
    return (
      <div className={styles.container}>
        <EmptyState
          iconPreset="alert"
          colorPreset="dark"
          iconColor="#0f172a"
          title="Convocatoria no encontrada"
          description="La convocatoria que buscas no existe o fue eliminada."
          className={styles.emptyState}
        >
          <button type="button" className={styles.emptyButton} onClick={handleBack}>
            Volver a Convocatorias
          </button>
        </EmptyState>
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
            <h1 className={styles.title}>Gestionar Encuestas</h1>
            <p className={styles.subtitle}>
              {convocatoria.title || `Convocatoria #${jobPostingId}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.grid}>
          <EvaluacionCard
            evaluationType="profile"
            evaluation={evaluaciones.profile}
            onManage={handleManageQuestions}
            index={0}
          />
          <EvaluacionCard
            evaluationType="technical"
            evaluation={evaluaciones.technical}
            onManage={handleManageQuestions}
            index={1}
          />
          <EvaluacionCard
            evaluationType="psychological"
            evaluation={evaluaciones.psychological}
            onManage={handleManageQuestions}
            index={2}
          />
          <EvaluacionCard
            evaluationType="motivation"
            evaluation={evaluaciones.motivation}
            onManage={handleManageQuestions}
            index={3}
          />
        </div>
      </div>
    </div>
  )
}

