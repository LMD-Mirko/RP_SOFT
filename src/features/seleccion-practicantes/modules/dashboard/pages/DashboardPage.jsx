import { Users, CheckSquare, Check, X, Clock } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'
import { RecentActivity } from '../components/RecentActivity'
import { UpcomingInterviews } from '../components/UpcomingInterviews'
import { useDashboard } from '../hooks/useDashboard'
import { useEffect, useState } from 'react'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const { stats, loading, loadUsersActivity } = useDashboard()
  const [activities, setActivities] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  // Mapear estadísticas de la API al formato esperado
  const statsData = stats ? [
    {
      title: 'Total Postulantes',
      value: stats.total_postulants || 0,
      detail: `Total registrados`,
      icon: Users,
      iconColor: 'blue',
      detailColor: 'success',
    },
    {
      title: 'Convocatorias activas',
      value: stats.active_convocatorias || 0,
      detail: `De ${stats.total_convocatorias || 0} totales`,
      icon: CheckSquare,
      iconColor: 'green',
      detailColor: 'info',
    },
    {
      title: 'Aceptados',
      value: stats.aceptados || 0,
      detail: stats.total_postulants 
        ? `${Math.round((stats.aceptados / stats.total_postulants) * 100)}% de aceptación`
        : '0% de aceptación',
      icon: Check,
      iconColor: 'green',
      detailColor: 'success',
    },
    {
      title: 'Rechazados',
      value: stats.rechazados || 0,
      detail: stats.total_postulants
        ? `${Math.round((stats.rechazados / stats.total_postulants) * 100)}% de rechazo`
        : '0% de rechazo',
      icon: X,
      iconColor: 'red',
      detailColor: 'danger',
    },
    {
      title: 'En proceso',
      value: stats.pendientes || 0,
      detail: stats.total_postulants
        ? `${Math.round((stats.pendientes / stats.total_postulants) * 100)}% en evaluación`
        : '0% en evaluación',
      icon: Clock,
      iconColor: 'orange',
      detailColor: 'warning',
    },
  ] : []

  useEffect(() => {
    let mounted = true;
    
    const loadActivities = async () => {
      if (!mounted) return;
      
      setLoadingActivities(true)
      try {
        const response = await loadUsersActivity({ page_size: 5 })
        if (!mounted) return;
        
        const mappedActivities = (response.results || []).map(activity => ({
          description: activity.description || activity.action || 'Actividad del sistema',
          name: activity.user_email || activity.user?.email || 'Sistema',
          time: activity.timestamp 
            ? new Date(activity.timestamp).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recientemente',
        }))
        setActivities(mappedActivities)
      } catch (error) {
        console.error('Error al cargar actividades:', error)
        if (mounted) {
          setActivities([])
        }
      } finally {
        if (mounted) {
          setLoadingActivities(false)
        }
      }
    }
    
    loadActivities()
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo ejecutar una vez al montar

  // Datos mock para próximas entrevistas (se pueden implementar cuando haya endpoints)
  const upcomingInterviews = []

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel Principal</h1>
          <p className={styles.subtitle}>
            Resumen del sistema de seleccion de practicantes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className={styles.loading}>
          <p>Cargando estadísticas...</p>
        </div>
      ) : (
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              index={index}
              title={stat.title}
              value={stat.value}
              detail={stat.detail}
              icon={stat.icon}
              iconColor={stat.iconColor}
              detailColor={stat.detailColor}
            />
          ))}
        </div>
      )}

      {/* Bottom Panels */}
      <div className={styles.panelsGrid}>
        <RecentActivity activities={activities} loading={loadingActivities} />
        <UpcomingInterviews interviews={upcomingInterviews} />
      </div>
    </div>
  )
}
