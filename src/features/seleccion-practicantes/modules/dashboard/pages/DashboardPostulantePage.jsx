import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  FileText, 
  TrendingUp, 
  Award,
  Calendar,
  Users,
  AlertCircle,
  Play,
  Eye,
  GraduationCap,
  Briefcase,
  User,
  BarChart3
} from 'lucide-react'
import { usePostulantDashboard } from '../hooks/usePostulantDashboard'
import { SkeletonStatsCard, SkeletonChart, SkeletonList } from '../../../shared/components/Skeleton'
import styles from './DashboardPostulantePage.module.css'
import dayjs from 'dayjs'

export function DashboardPostulantePage() {
  const { dashboardData, loading } = usePostulantDashboard()
  const navigate = useNavigate()

  const progress = dashboardData?.progress
  const exams = dashboardData?.exams || []
  const evaluations = dashboardData?.evaluations
  const statistics = dashboardData?.statistics

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return dayjs(dateString).format('DD/MM/YYYY')
  }

  // Calcular porcentaje de progreso
  const progressPercentage = progress?.total_percentage || 0

  // Estadísticas principales
  const statsData = statistics ? [
    {
      title: 'Progreso General',
      value: `${progressPercentage.toFixed(1)}%`,
      detail: `${progress?.completed_stages || 0} de ${progress?.total_stages || 0} etapas completadas`,
      icon: TrendingUp,
      iconColor: 'green',
      detailColor: 'success',
    },
    {
      title: 'Exámenes Pendientes',
      value: statistics.exams_pending || 0,
      detail: `${statistics.total_exams || 0} total`,
      icon: BookOpen,
      iconColor: 'green',
      detailColor: 'warning',
    },
    {
      title: 'Evaluaciones Completadas',
      value: evaluations?.summary?.completed || 0,
      detail: `${evaluations?.summary?.passed || 0} aprobadas`,
      icon: CheckCircle,
      iconColor: 'green',
      detailColor: 'success',
    },
    {
      title: 'Promedio Evaluaciones',
      value: `${evaluations?.summary?.average_score?.toFixed(1) || 0}%`,
      detail: `${evaluations?.summary?.total_evaluations || 0} evaluaciones`,
      icon: Award,
      iconColor: 'green',
      detailColor: 'info',
    },
  ] : []

  // Etapas del proceso
  const stages = progress?.stages_detail || []

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Mi Panel</h1>
            <p className={styles.subtitle}>
              {progress 
                ? `Bienvenido, ${progress.user_full_name || 'Postulante'}`
                : 'Bienvenido a tu panel de postulante'
              }
            </p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {loading ? (
          <>
            <SkeletonStatsCard index={0} />
            <SkeletonStatsCard index={1} />
            <SkeletonStatsCard index={2} />
            <SkeletonStatsCard index={3} />
          </>
        ) : (
          statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index} 
                className={styles.statCard}
                style={{ 
                  animationDelay: `${index * 0.1}s` 
                }}
              >
                <div className={styles.statIcon}>
                  <Icon size={24} />
                </div>
                <div className={styles.statContent}>
                  <h3 className={styles.statTitle}>{stat.title}</h3>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statDetail}>{stat.detail}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Progreso del Proceso */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Progreso del Proceso</h2>
              <div className={styles.progressBadge}>
                {progress?.process_status || 'En proceso'}
              </div>
            </div>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className={styles.progressText}>
                {progressPercentage.toFixed(1)}% completado
              </p>
            </div>
            <div className={styles.stagesList}>
              {stages.map((stage, index) => (
                <div key={index} className={styles.stageItem}>
                  <div className={styles.stageIcon}>
                    {stage.completed ? (
                      <CheckCircle size={20} className={styles.completedIcon} />
                    ) : (
                      <Clock size={20} className={styles.pendingIcon} />
                    )}
                  </div>
                  <div className={styles.stageContent}>
                    <p className={styles.stageName}>{stage.stage}</p>
                    {stage.completed_at && (
                      <p className={styles.stageDate}>
                        Completado: {formatDate(stage.completed_at)}
                      </p>
                    )}
                  </div>
                  <div className={styles.stagePercentage}>
                    {stage.percentage}%
                  </div>
                </div>
              ))}
            </div>
            {progress?.next_stage && (
              <div className={styles.nextStage}>
                <AlertCircle size={16} />
                <span>Próxima etapa: {progress.next_stage}</span>
              </div>
            )}
          </div>

          {/* Información Personal */}
          {progress && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Información Personal</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <GraduationCap size={18} className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Especialidad</span>
                    <span className={styles.infoValue}>{progress.specialty?.name || '-'}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <Briefcase size={18} className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Carrera</span>
                    <span className={styles.infoValue}>{progress.career || '-'}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <BarChart3 size={18} className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Semestre</span>
                    <span className={styles.infoValue}>{progress.semester || '-'}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <User size={18} className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Nivel de Experiencia</span>
                    <span className={styles.infoValue}>{progress.experience_level || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Exámenes Asignados */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Exámenes</h2>
            </div>
            {loading ? (
              <SkeletonList items={3} />
            ) : exams.length > 0 ? (
              <div className={styles.examsList}>
                {exams.map((exam) => (
                  <div key={exam.id} className={styles.examItem}>
                    <div className={styles.examHeader}>
                      <h3 className={styles.examTitle}>{exam.title}</h3>
                      <span className={`${styles.examStatus} ${styles[exam.status]}`}>
                        {exam.status === 'assigned' ? 'Asignado' : 
                         exam.status === 'completed' ? 'Completado' : exam.status}
                      </span>
                    </div>
                    <p className={styles.examDescription}>{exam.description}</p>
                    <div className={styles.examDetails}>
                      <span>
                        <Calendar size={14} />
                        Hasta: {formatDate(exam.end_date)}
                      </span>
                      <span>
                        <Clock size={14} />
                        {exam.time_limit_minutes} min
                      </span>
                      {exam.average_score !== null && (
                        <span>
                          <Award size={14} />
                          {exam.average_score.toFixed(1)}/20
                        </span>
                      )}
                    </div>
                    <div className={styles.examActions}>
                      {exam.can_start && !exam.has_active_attempt && (
                        <button
                          onClick={() => navigate(`/seleccion-practicantes/examenes/${exam.id}/realizar`)}
                          className={styles.examButton}
                        >
                          <Play size={16} />
                          Iniciar Examen
                        </button>
                      )}
                      {exam.has_active_attempt && (
                        <button
                          onClick={() => navigate(`/seleccion-practicantes/examenes/${exam.id}/realizar`)}
                          className={styles.examButton}
                        >
                          <Clock size={16} />
                          Continuar Examen
                        </button>
                      )}
                      {exam.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/seleccion-practicantes/examenes/asignados`)}
                          className={styles.examButtonSecondary}
                        >
                          <Eye size={16} />
                          Ver Resultados
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <BookOpen size={48} className={styles.emptyIcon} />
                <p>No tienes exámenes asignados</p>
              </div>
            )}
          </div>

          {/* Evaluaciones */}
          {evaluations && evaluations.status && evaluations.status.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Evaluaciones</h2>
              </div>
              <div className={styles.evaluationsListContainer}>
                <div className={styles.evaluationsList}>
                  {evaluations.status.map((evaluation, index) => (
                    <div key={index} className={styles.evaluationItem}>
                      <div className={styles.evaluationHeader}>
                        <h3 className={styles.evaluationTitle}>{evaluation.title}</h3>
                        <span className={`${styles.evaluationStatus} ${styles[evaluation.status]}`}>
                          {evaluation.status === 'completed' ? 'Completada' : evaluation.status}
                        </span>
                      </div>
                      <div className={styles.evaluationDetails}>
                        <div className={styles.evaluationScore}>
                          <Award size={16} />
                          <span>Puntuación: {evaluation.score.toFixed(1)}/20 ({evaluation.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className={styles.evaluationResult}>
                          {evaluation.passed ? (
                            <CheckCircle size={16} className={styles.passedIcon} />
                          ) : (
                            <AlertCircle size={16} className={styles.failedIcon} />
                          )}
                          <span>{evaluation.passed ? 'Aprobada' : 'No aprobada'}</span>
                        </div>
                      </div>
                      {evaluation.completed_at && (
                        <p className={styles.evaluationDate}>
                          Completada: {formatDate(evaluation.completed_at)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

