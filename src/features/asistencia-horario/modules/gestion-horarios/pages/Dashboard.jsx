import { useState } from 'react'
import {
  StatsCards,
  CalendarWeekView,
  AddScheduleDialog,
  PractitionersScheduleList,
  ScheduleApprovalPanel,
  FilterBar
} from '../components'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('vista-semanal')

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Gestión de Horarios</h1>
          <p>Centraliza los horarios de clases con evidencias y un calendario asistencial automático</p>
        </div>
        <AddScheduleDialog />
      </div>

      <StatsCards />
      
      <FilterBar />

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'vista-semanal' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('vista-semanal')}
        >
          Vista Semanal
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'lista-practicantes' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('lista-practicantes')}
        >
          Lista de Practicantes
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'pendientes' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('pendientes')}
        >
          Pendientes de Aprobación
        </button>
      </div>

      {activeTab === 'vista-semanal' && (
        <div className={styles.mainContent}>
          <CalendarWeekView />
        </div>
      )}

      {activeTab === 'lista-practicantes' && (
        <div className={styles.mainContent}>
          <PractitionersScheduleList />
        </div>
      )}

      {activeTab === 'pendientes' && (
        <div className={styles.mainContent}>
          <ScheduleApprovalPanel />
        </div>
      )}
    </div>
  )
}
