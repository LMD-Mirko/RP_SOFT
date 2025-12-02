import { useState, useEffect } from 'react'  // Agregar useEffect
import { Eye, Edit, Trash2 } from 'lucide-react'
import styles from './EventosEvaluacionPage.module.css'

export function EventosEvaluacionPage() {
  const [activeTab, setActiveTab] = useState('todos')
  const [mostrarContenido, setMostrarContenido] = useState(false) // NUEVO: Estado para animaciones

  // NUEVO: Efecto para animación de entrada
  useEffect(() => {
    setMostrarContenido(true)
  }, [])

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
    <div className={`${styles.container} ${mostrarContenido ? styles.fadeIn : ''}`}>
      {/* Header - CON ANIMACIÓN */}
      <div className={`${styles.header} ${styles.slideIn}`}>
        <div className={styles.headerContent}>
          <h1>Evento de Evaluación</h1>
          <p>Crea y administra eventos de evaluación con equipos y criterios</p>
        </div>
        <button className={styles.createButton}>
          Crear Evento
        </button>
      </div>

      {/* Tabs - SELECTORES MEJORADOS */}
      <div className={`${styles.tabs} ${styles.slideIn}`} style={{animationDelay: '0.1s'}}>
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

      {/* Evaluaciones List - CON ANIMACIONES */}
      <div className={styles.evaluacionesList}>
        {filteredEvaluaciones.map((evaluacion, index) => (
          <div 
            key={evaluacion.id} 
            className={`${styles.evaluacionCard} ${styles.slideIn}`}
            style={{animationDelay: `${0.2 + (index * 0.1)}s`}}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardMain}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{evaluacion.titulo}</h3>
                  <span className={`${styles.badge} ${
                    evaluacion.estado === 'Activo' ? styles.badgeActive : styles.badgeClosed
                  }`}>
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
        <div className={`${styles.emptyState} ${styles.slideIn}`}>
          <p>No hay evaluaciones para mostrar</p>
        </div>
      )}
    </div>
  )
}