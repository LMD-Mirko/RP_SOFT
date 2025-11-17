/**
 * Componente Dashboard principal
 * Vista completa del dashboard de Convenios y Constancias
 */

import { Users, Clock, AlertCircle, Send } from 'lucide-react'
import { KPICard, SearchBar, Tabs, PracticantesTable } from '../components'
import { useDashboard } from '../hooks/useDashboard'
import styles from '../styles/Dashboard.module.css'

export function Dashboard() {
  const {
    searchTerm,
    filterValue,
    activeTab,
    kpis,
    tabs,
    practicantes,
    totalPracticantes,
    handleSearchChange,
    handleFilterChange,
    handleTabChange,
    handleDownload
  } = useDashboard()

  // Mapeo de iconos para las KPI cards
  const iconMap = {
    total: Users,
    pendientes: Clock,
    observados: AlertCircle,
    listos: Send
  }

  return (
    <div className={styles.container}>
      {/* Encabezado */}
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Convenios y Constancias</h1>
        <p className={styles.subtitle}>Bienvenido al módulo de Convenios y Constancias</p>
      </div>

      {/* Tarjetas de métricas (KPI Cards) */}
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => {
          const IconComponent = iconMap[kpi.id]
          return (
            <KPICard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              description={kpi.description}
              icon={IconComponent}
              iconColor={kpi.iconColor}
            />
          )
        })}
      </div>

      {/* Sección de búsqueda y filtros */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        onDownload={handleDownload}
      />

      {/* Contenedor principal de tabs y tabla */}
      <div className={styles.mainCard}>
        {/* Tabs de navegación */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tabla de practicantes */}
        <PracticantesTable
          practicantes={practicantes}
          totalCount={totalPracticantes}
        />
      </div>
    </div>
  )
}

