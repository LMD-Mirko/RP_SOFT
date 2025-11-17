import { FileText, Download, Eye, Calendar, User, Briefcase, CheckCircle2, Clock } from 'lucide-react'
import { EmptyState } from '@shared/components/EmptyState'
import { Skeleton } from '../../../../shared/components/Skeleton'
import styles from './CVsTable.module.css'

/**
 * Formatea el tamaño del archivo
 */
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Formatea la fecha
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'N/A'
  }
}

export function CVsTable({ 
  cvs = [], 
  loading = false, 
  onPreview, 
  onDownload 
}) {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Convocatoria</th>
                <th>Archivo</th>
                <th>Tamaño</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className={styles.row}>
                  <td>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={16} height={16} />
                      <div style={{ flex: 1 }}>
                        <Skeleton variant="text" width="70%" height={14} />
                        <Skeleton variant="text" width="50%" height={12} style={{ marginTop: '4px' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Skeleton variant="rectangular" width={16} height={16} />
                      <div style={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" height={14} />
                        <Skeleton variant="text" width="60%" height={12} style={{ marginTop: '4px' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Skeleton variant="rectangular" width={16} height={16} />
                      <Skeleton variant="text" width="60%" height={14} />
                    </div>
                  </td>
                  <td><Skeleton variant="text" width="50px" height={14} /></td>
                  <td><Skeleton variant="rectangular" width={100} height={24} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Skeleton variant="rectangular" width={14} height={14} />
                      <Skeleton variant="text" width="80px" height={14} />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Skeleton variant="rectangular" width={32} height={32} />
                      <Skeleton variant="rectangular" width={32} height={32} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (cvs.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          iconPreset="document"
          colorPreset="blue"
          title="No hay CVs disponibles"
          description="No se encontraron CVs con los filtros aplicados"
          className={styles.emptyState}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Convocatoria</th>
              <th>Archivo</th>
              <th>Tamaño</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cvs.map((cv) => (
              <tr key={cv.id} className={styles.row}>
                <td>
                  <div className={styles.userCell}>
                    <User size={16} className={styles.icon} />
                    <div>
                      <div className={styles.userName}>
                        {cv.user_name || 'N/A'}
                      </div>
                      <div className={styles.userEmail}>{cv.user_email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {cv.postulant_info?.job_posting_title ? (
                    <div className={styles.convocatoriaCell}>
                      <Briefcase size={16} className={styles.icon} />
                      <div>
                        <div className={styles.convocatoriaTitle}>
                          {cv.postulant_info.job_posting_title}
                        </div>
                        <div className={styles.convocatoriaStatus}>
                          {cv.postulant_info.process_status} • {cv.postulant_info.current_stage}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className={styles.na}>N/A</span>
                  )}
                </td>
                <td>
                  <div className={styles.fileCell}>
                    <FileText size={16} className={styles.icon} />
                    <span className={styles.filename}>{cv.original_filename}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.fileSize}>{formatFileSize(cv.file_size)}</span>
                </td>
                <td>
                  {cv.is_verified ? (
                    <span className={styles.badgeVerified}>
                      <CheckCircle2 size={14} />
                      Verificado
                    </span>
                  ) : (
                    <span className={styles.badgePending}>
                      <Clock size={14} />
                      Pendiente
                    </span>
                  )}
                </td>
                <td>
                  <div className={styles.dateCell}>
                    <Calendar size={14} className={styles.icon} />
                    <span>{formatDate(cv.created_at)}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => onPreview(cv)}
                      title="Previsualizar"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => onDownload(cv)}
                      title="Descargar"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

