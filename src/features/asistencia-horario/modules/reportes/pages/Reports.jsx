import { useState } from 'react'
import { Download, CheckCircle, Clock, FileText } from 'lucide-react'
import { ReportsCards } from '../components/StatsCardReports/ReportsCards'
import styles from './Reports.module.css'
import { HoursWorked } from '../components/HoursWorked/HoursWorked'
import ContentWarnings from '../components/Warning/ContentWarnings'
import HourDetail from '../components/HoursWorked/HourDetail'
import ComplianceSummary from '../components/HoursWorked/ComplianceSummary'
import Permissions from '../components/Permissions/Permissions'
// Datos del historial de advertencias (ejemplo con fecha y detalle)
const historialAdvertencias = [
  { nombre: 'Juan Pérez', fecha: '2025-09-28', descripcion: 'Segundo llamado sin respuesta', tag: 'unanswered-call' },
  { nombre: 'Juan Pérez', fecha: '2025-09-25', descripcion: 'Falta sin justificar', tag: 'unjustified-absence' },
  { nombre: 'María López', fecha: '2025-09-29', descripcion: 'Segundo llamado sin respuesta', tag: 'unanswered-call' },
];


export function Reports() {
  const [activeTab, setActiveTab] = useState('advertencias')

  const tabs = [
    { id: 'advertencias', label: 'Advertencias' },
    { id: 'horas', label: 'Horas Trabajadas' },
    { id: 'permisos', label: 'Permisos' }
  ]

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Reportes y Análisis</h1>
          <p>Informes semanales y mensuales del sistema</p>
        </div>
      </div>

      <ReportsCards />
      
      <div className={styles.exportSection}>
        <h2>Exportar Reportes</h2>
        <p>Descarga reportes en formato Excel</p>
        <div className={styles.exportButtons}>
          <button className={styles.downloadButton}>
            <Download size={20} />
            Descargar Reporte Semanal (Excel)
          </button>
          <button className={styles.downloadButton}>
            <Download size={20} />
            Descargar Reporte Mensual (Excel)
          </button>
        </div>
      </div>

      
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'advertencias' && (
            <div className={styles.content}>
              <ContentWarnings />
                            <ContentWarnings 
                              title="Historial de Advertencias"
                              description="Todas las advertencias registradas"
                              dataArray={historialAdvertencias}
                              mode="historial"
                            />
              
            </div>
          )}
          {activeTab === 'horas' && (
            <div className={styles.content}>
              <HoursWorked />
              <HourDetail />
              <ComplianceSummary />
            </div>
          )}
          {activeTab === 'permisos' && (
            <div className={styles.content}>
              <Permissions />
              <Permissions 
                title="Resumen de Permisos por Practicante"
                description="Conteo semanal"
                mode="resumen"
              />
            </div>
          )}
        </div>
      </div>
  )
}