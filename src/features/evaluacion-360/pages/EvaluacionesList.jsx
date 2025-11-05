import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import styles from './EvaluacionesList.module.css'

export function EvaluacionesList() {
  const [activeTab, setActiveTab] = useState('todos')
  const navigate = useNavigate()

  // Función para ir a la vista de Evaluación Técnica
  const irAEvaluacionTecnica = () => {
    navigate('/evaluacion-360/evaluacion-tecnica')
  }

  const evaluaciones = [
    {
      id: 1,
      titulo: 'Hackthon Scrum - Semana 4',
      descripcion: 'Evaluación de proyectos Scrum con roles, eventos y artefactos',
      fechaInicio: '10/02/2025',
      fechaFin: '15/02/2025',
      estado: 'Activo',
      creadoPor: 'Carlos Mendoza'
    },
    {
      id: 2,
      titulo: 'Hackthon Scrum - Semana 3',
      descripcion: 'Evaluación de proyectos Scrum con roles, eventos y artefactos',
      fechaInicio: '04/02/2025',
      fechaFin: '09/02/2025',
      estado: 'Cerrado',
      creadoPor: 'Fernando Ramirez'
    }
  ]

  const tabs = [
    { id: 'todos', label: 'Todos', count: 2 },
    { id: 'activos', label: 'Activos', count: 1 },
    { id: 'cerrados', label: 'Cerrados', count: 0 }
  ]

  const filteredEvaluaciones = evaluaciones.filter(evaluacion => {
    if (activeTab === 'activos') return evaluacion.estado === 'Activo'
    if (activeTab === 'cerrados') return evaluacion.estado === 'Cerrado'
    return true
  })

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Evento de Evaluación</h1>
          <p>Crea y administra eventos de evaluación con equipos y criterios</p>
        </div>
        <button className={styles.createButton}>
          Crear Evento
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : styles.tabInactive}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Evaluaciones List */}
      <div className={styles.evaluacionesList}>
        {filteredEvaluaciones.map(evaluacion => (
          <div key={evaluacion.id} className={styles.evaluacionCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardMain}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{evaluacion.titulo}</h3>
                  <span className={`${styles.badge} ${evaluacion.estado === 'Activo' ? styles.badgeActive : styles.badgeClosed}`}>
                    {evaluacion.estado}
                  </span>
                </div>

                <p className={styles.cardDescription}>{evaluacion.descripcion}</p>

                <div className={styles.cardDates}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span>{evaluacion.fechaInicio} - {evaluacion.fechaFin}</span>
                </div>

                <hr className={styles.divider} />

                <div className={styles.cardFooter}>
                  <span>Creado por {evaluacion.creadoPor}</span>
                </div>
              </div>

              {/* Botones de acciones */}
              <div className={styles.cardActions}>
                {evaluacion.estado === 'Cerrado' && (
                  <button className={styles.actionButton}>
                    Activar
                  </button>
                )}
                {evaluacion.estado === 'Activo' && (
                  <button className={styles.actionButtonGray}>
                    Cerrar
                  </button>
                )}

                {/* Nuevo botón para ir a la vista de Evaluación Técnica */}
                {evaluacion.estado === 'Activo' && (
                  <button 
                    className={styles.actionButton}
                    onClick={irAEvaluacionTecnica}
                  >
                    Evaluar Técnica
                  </button>
                )}

                <button className={styles.iconButton}>
                  <Eye className="w-4 h-4" />
                </button>
                <button className={styles.iconButton}>
                  <Edit className="w-4 h-4" />
                </button>
                <button className={`${styles.iconButton} ${styles.iconButtonDelete}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvaluaciones.length === 0 && (
        <div className={styles.emptyState}>
          <p>No hay evaluaciones para mostrar</p>
        </div>
      )}
    </div>
  )
}
