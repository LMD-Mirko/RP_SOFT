import { useState } from 'react'
import { Clock, Info, Search, AlertCircle, RefreshCw, User, Eye, FileText } from 'lucide-react'
import styles from '../styles/RevisionDocumentos.module.css'

export default function RevisionDocumentos() {
  const [revisionAutomatica, setRevisionAutomatica] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className={styles.container}>
      {/* Encabezado */}
      <div className={styles.header}>
        <h1 className={styles.title}>Revision de documentos</h1>
        <p className={styles.subtitle}>Revisa y aprueba los documentos subidos por estudiantes</p>
      </div>

      {/* Tarjetas de estadísticas superiores */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div>
              <p className={styles.statLabel}>Pendientes de Revision</p>
              <p className={styles.statValue}>10 Total</p>
            </div>
            <Clock size={24} className={styles.statIcon} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div>
              <p className={styles.statLabel}>Estudiantes Afectados</p>
              <p className={styles.statValue}>5 Total</p>
            </div>
            <Info size={24} className={styles.statIcon} />
          </div>
        </div>
      </div>

      {/* Sección de documentos pendientes */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Documentos pendientes</h2>
            <p className={styles.cardSubtitle}>Revisa y aprueba o corrige los documentos.</p>
          </div>
          <div className={styles.toggleWrapper}>
            <span className={styles.toggleLabel}>Revision automatica</span>
            <button
              className={`${styles.toggle} ${revisionAutomatica ? styles.toggleActive : ''}`}
              onClick={() => setRevisionAutomatica(!revisionAutomatica)}
              aria-label="Toggle revisión automática"
            >
              <span className={`${styles.toggleThumb} ${revisionAutomatica ? styles.toggleThumbActive : ''}`} />
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className={styles.searchWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Tarjetas de documentos en revisión */}
      <div className={styles.documentCard}>
        <div className={styles.documentHeader}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badge}>En revision</span>
            <AlertCircle size={16} className={styles.badgeIcon} />
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn}>
              <RefreshCw size={16} />
              Auto-revisar
            </button>
            <button className={styles.actionBtn}>
              <User size={16} />
              Ver perfil
            </button>
            <button className={styles.actionBtn}>
              <Eye size={16} />
              Revisar
            </button>
          </div>
        </div>

        <div className={styles.documentInfo}>
          <div className={styles.documentTitle}>
            <FileText size={20} className={styles.documentIcon} />
            <span className={styles.documentName}>Carta de presentacion</span>
          </div>
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Estudiante:</span> Carlos Alberto Mendoza Silva (DNI:74567890)
          </p>
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Programa:</span> Desarrollo de Software
          </p>
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Subido:</span> 4/2/2025 - Version 1
          </p>
        </div>
      </div>

      {/* Segunda tarjeta de documento (ejemplo adicional) */}
      <div className={styles.documentCard}>
        <div className={styles.documentHeader}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badge}>En revision</span>
            <AlertCircle size={16} className={styles.badgeIcon} />
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn}>
              <RefreshCw size={16} />
              Auto-revisar
            </button>
            <button className={styles.actionBtn}>
              <User size={16} />
              Ver perfil
            </button>
            <button className={styles.actionBtn}>
              <Eye size={16} />
              Revisar
            </button>
          </div>
        </div>

        <div className={styles.documentInfo}>
          <div className={styles.documentTitle}>
            <FileText size={20} className={styles.documentIcon} />
            <span className={styles.documentName}>Carta de presentacion</span>
          </div>
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Estudiante:</span> Carlos Alberto Mendoza Silva (DNI:74567890)
          </p>
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Programa:</span> Desarrollo de Software
          </p>
          <p className={styles.infoLine}>
            <span className={styles.infoLabel}>Subido:</span> 4/2/2025 - Version 1
          </p>
        </div>
      </div>
    </div>
  )
}
