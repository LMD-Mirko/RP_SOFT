import { Users, CheckSquare, Check, X, Clock } from 'lucide-react'
import { StatsCard } from '../components/StatsCard'
import { RecentActivity } from '../components/RecentActivity'
import { UpcomingInterviews } from '../components/UpcomingInterviews'
import styles from './DashboardPage.module.css'

// Datos de ejemplo - estos vendrán de un servicio o store en el futuro
const statsData = [
  {
    title: 'Total Postulantes',
    value: 42,
    detail: '+12 esta semana',
    icon: Users,
    iconColor: 'blue',
    detailColor: 'success',
  },
  {
    title: 'Convocatorias activas',
    value: 2,
    detail: 'Enero y Febrero 2024',
    icon: CheckSquare,
    iconColor: 'green',
    detailColor: 'info',
  },
  {
    title: 'Aceptados',
    value: 8,
    detail: '15% de aceptación',
    icon: Check,
    iconColor: 'green',
    detailColor: 'success',
  },
  {
    title: 'Rechazados',
    value: 5,
    detail: '12% de rechazo',
    icon: X,
    iconColor: 'red',
    detailColor: 'danger',
  },
  {
    title: 'En proceso',
    value: 29,
    detail: '69% en evaluación',
    icon: Clock,
    iconColor: 'orange',
    detailColor: 'warning',
  },
]

const recentActivities = [
  {
    description: 'Nuevo postulante registrado',
    name: 'Juan Perez',
    time: 'Hace 2 horas',
  },
  {
    description: 'Evaluación completada',
    name: 'Maria Gonzalez',
    time: 'Hace 3 horas',
  },
  {
    description: 'Entrevista programada',
    name: 'Carlos Rodriguez',
    time: 'Hace 5 horas',
  },
  {
    description: 'CV descargado',
    name: 'Ana Martinez',
    time: 'Hace 1 día',
  },
]

const upcomingInterviews = [
  {
    name: 'Juan Perez',
    date: '20 Ene, 10:00 am',
    status: 'confirmada',
  },
  {
    name: 'Maria Gonzalez',
    date: '21 Ene, 2:00 pm',
    status: 'pendiente',
  },
  {
    name: 'Carlos Rodriguez',
    date: '22 Ene, 11:00 am',
    status: 'reservada',
  },
]

export function DashboardPage() {
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

      {/* Bottom Panels */}
      <div className={styles.panelsGrid}>
        <RecentActivity activities={recentActivities} />
        <UpcomingInterviews interviews={upcomingInterviews} />
      </div>
    </div>
  )
}
