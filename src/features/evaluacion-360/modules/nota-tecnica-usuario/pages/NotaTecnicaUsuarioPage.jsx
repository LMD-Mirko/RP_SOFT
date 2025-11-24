import { useState, useEffect } from 'react'
import { Search, BookOpen } from 'lucide-react' // Quité FileText
import styles from './NotaTecnicaUsuarioPage.module.css'

function NotaTecnicaUsuarioPage() {
  const [mostrarContenido, setMostrarContenido] = useState(false)

  useEffect(() => {
    setMostrarContenido(true)
  }, [])

  // Datos de ejemplo basados en el Figma
  const notasTecnicas = [
    {
      id: 1,
      semanas: ['Semana 1', 'Semana 2'],
      practicante: 'Jared Fernández Medina',
      servidor: '6to Py de Innovación',
      proyecto: '-',
      sala: '5',
      enRiesgo: 'No',
      notaIndividual: '18',
      supervisor: 'Anthony Ramos LD',
      comentarios: 'Se mantendrá los comentarios...'
    },
    {
      id: 2,
      semanas: ['Semana 3', 'Semana 4', 'Semana 5'],
      practicante: 'Jared Fernández Medina',
      servidor: '6to Py de Innovación',
      proyecto: '-',
      sala: '5',
      enRiesgo: 'No',
      notaIndividual: '17',
      supervisor: 'Teodoro Condor LD',
      comentarios: 'Se mantendrá los comentarios...'
    },
    {
      id: 3,
      semanas: ['Semana 6', 'Semana 7', 'Semana 8'],
      practicante: 'Jared Fernández Medina',
      servidor: '6to Py de Innovación',
      proyecto: '-',
      sala: '5',
      enRiesgo: 'No',
      notaIndividual: '19',
      supervisor: 'Wilber Peralta AD',
      comentarios: 'Se mantendrá los comentarios...'
    }
  ]

  return (
    <div className={`${styles.container} ${mostrarContenido ? styles.fadeIn : ''}`}>
      
      {/* Header solo con título e icono */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleWithIcon}>
            <h1>Notas de Evaluación Técnica</h1>
            <div className={styles.titleIcon}>
              <BookOpen size={24} color="white" />
            </div>
          </div>
          <p>Visualiza tus notas técnicas</p>
        </div>
      </div>

      {/* Search Container más pequeño */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Selecciona una semana"
          className={styles.searchInput}
        />
      </div>

      {/* Lista de Notas Técnicas */}
      <div className={styles.notasList}>
        {notasTecnicas.map((nota, index) => (
          <div 
            key={nota.id} 
            className={`${styles.notaCard} ${styles.slideIn}`}
            style={{animationDelay: `${index * 0.1}s`}}
          >
            
            {/* Header de la Nota - SIN ICONO */}
            <div className={styles.notaHeader}>
              <h3 className={styles.notaTitle}>
                Nota Técnica {/* Quité el icono FileText */}
              </h3>
              <div className={styles.semanasContainer}>
                {nota.semanas.map((semana, i) => (
                  <span key={i} className={styles.semanaTag}>{semana}</span>
                ))}
              </div>
            </div>

            {/* Información del Practicante - Estilo tabla */}
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <div className={styles.infoGroup}>
                  <label>Practicante:</label>
                  <span>{nota.practicante}</span>
                </div>
                <div className={styles.infoGroup}>
                  <label>Servidor:</label>
                  <span>{nota.servidor}</span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoGroup}>
                  <label>Proyecto:</label>
                  <span>{nota.proyecto}</span>
                </div>
                <div className={styles.infoGroup}>
                  <label>Sala:</label>
                  <span>{nota.sala}</span>
                </div>
              </div>
            </div>

            {/* Estado de Riesgo y Nota */}
            <div className={styles.statusGrid}>
              <div className={styles.statusGroup}>
                <label>En Riesgo:</label>
                <span className={`${styles.riesgoBadge} ${
                  nota.enRiesgo === 'Sí' ? styles.riesgoSi : styles.riesgoNo
                }`}>
                  {nota.enRiesgo}
                </span>
              </div>
              <div className={styles.statusGroup}>
                <label>Nota individual:</label>
                <span className={styles.notaValue}>{nota.notaIndividual}</span>
              </div>
            </div>

            {/* Supervisor y Comentarios */}
            <div className={styles.supervisorSection}>
              <div className={styles.supervisorInfo}>
                <label>Supervisor:</label>
                <span>{nota.supervisor}</span>
              </div>
              <p className={styles.comentarios}>{nota.comentarios}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default NotaTecnicaUsuarioPage;