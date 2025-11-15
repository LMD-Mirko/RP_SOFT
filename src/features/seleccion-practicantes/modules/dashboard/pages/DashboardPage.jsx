import { Users, UserCheck, CheckSquare, TrendingUp } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'
import { PostulantsStatusChart } from '../components/PostulantsStatusChart'
import { ConvocatoriasStatusChart } from '../components/ConvocatoriasStatusChart'
import { NewUsersList } from '../components/NewUsersList'
import { RecentActivity } from '../components/RecentActivity'
import { ProgressDistributionChart } from '../components/ProgressDistributionChart'
import { ProgressBySpecialtyChart } from '../components/ProgressBySpecialtyChart'
import { ProgressByConvocatoriaChart } from '../components/ProgressByConvocatoriaChart'
import { useDashboard } from '../hooks/useDashboard'
import { useEffect, useState } from 'react'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const { stats, usersStats, averageProgress, loading, loadUsersActivity } = useDashboard()
  const [activities, setActivities] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  // Debug: Log de datos
  useEffect(() => {
    console.log('=== DASHBOARD DEBUG ===')
    console.log('Stats:', stats)
    console.log('UsersStats:', usersStats)
    console.log('AverageProgress:', averageProgress)
    console.log('Loading:', loading)
    console.log('========================')
  }, [stats, usersStats, averageProgress, loading])

  // Mapear estadísticas de la API al formato esperado
  const statsData = stats ? [
    {
      title: 'Total Usuarios',
      value: stats.total_users || 0,
      detail: usersStats?.users_by_status 
        ? `${usersStats.users_by_status.active} activos, ${usersStats.users_by_status.inactive} inactivos`
        : 'Total registrados',
      icon: Users,
      iconColor: 'blue',
      detailColor: 'success',
    },
    {
      title: 'Total Postulantes',
      value: stats.total_postulants || 0,
      detail: stats.postulants_this_week 
        ? `${stats.postulants_this_week} esta semana`
        : 'Total registrados',
      icon: UserCheck,
      iconColor: 'purple',
      detailColor: 'info',
    },
    {
      title: 'Convocatorias',
      value: stats.total_convocatorias || 0,
      detail: stats.convocatorias_by_status
        ? `${stats.convocatorias_by_status.find(c => c.status === 'abierta')?.count || 0} abiertas`
        : 'Total registradas',
      icon: CheckSquare,
      iconColor: 'green',
      detailColor: 'success',
    },
    {
      title: 'Nuevos Usuarios',
      value: usersStats?.total_new_users_week || 0,
      detail: usersStats?.total_new_users_month
        ? `${usersStats.total_new_users_month} este mes`
        : 'Esta semana',
      icon: TrendingUp,
      iconColor: 'orange',
      detailColor: 'warning',
    },
  ] : []

  useEffect(() => {
    let mounted = true;
    let cancelled = false;
    
    const loadActivities = async () => {
      if (!mounted || cancelled) return;
      
      setLoadingActivities(true)
      try {
        const response = await loadUsersActivity({ page_size: 5 })
        if (!mounted || cancelled) return;
        
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
        if (mounted && !cancelled) {
          setActivities(mappedActivities)
        }
      } catch (error) {
        console.error('Error al cargar actividades:', error)
        if (mounted && !cancelled) {
          setActivities([])
        }
      } finally {
        if (mounted && !cancelled) {
          setLoadingActivities(false)
        }
      }
    }
    
    loadActivities()
    
    return () => {
      mounted = false;
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo ejecutar una vez al montar

  // No bloquear toda la UI si solo están cargando algunas cosas
  // if (loading) {
  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.loadingState}>
  //         <div className={styles.spinner}></div>
  //         <p>Cargando dashboard...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Panel Principal</h1>
            <p className={styles.subtitle}>
              {stats 
                ? `Mostrando ${stats.total_postulants || 0} postulantes de ${stats.total_users || 0} usuarios totales`
                : 'Resumen del sistema de selección de practicantes'
              }
            </p>
          </div>
        </div>
      </header>

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

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div className={styles.chartCard}>
            <PostulantsStatusChart data={stats?.postulants_by_status || []} />
          </div>
          
          {/* Progreso por Convocatoria - Gráfico de Línea */}
          <div className={styles.chartCard}>
            <ProgressByConvocatoriaChart data={averageProgress?.by_convocatoria || []} />
          </div>

          {usersStats?.new_users_this_week && usersStats.new_users_this_week.length > 0 && (
            <div className={styles.listCard}>
              <NewUsersList 
                users={usersStats.new_users_this_week} 
                title="Nuevos Usuarios"
                period="week"
                loading={false}
              />
            </div>
          )}

          {/* Actividad Reciente - Movido a la izquierda */}
          <div className={styles.listCard}>
            <RecentActivity activities={activities} loading={loadingActivities} />
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.chartCard}>
            <ConvocatoriasStatusChart data={stats?.convocatorias_by_status || []} />
          </div>

          {/* Distribución de Progreso - Gráfico de Dona */}
          <div className={styles.chartCard}>
            <ProgressDistributionChart data={averageProgress?.progress_distribution || {}} />
          </div>

          {/* Progreso por Especialidad - Gráfico Combinado (Barras + Línea) */}
          <div className={styles.chartCard}>
            <ProgressBySpecialtyChart data={averageProgress?.by_specialty || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
