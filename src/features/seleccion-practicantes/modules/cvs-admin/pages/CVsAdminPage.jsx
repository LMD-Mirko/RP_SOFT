import { useState, useMemo } from 'react'
import { FileText } from 'lucide-react'
import { useCVsAdmin } from '../hooks/useCVsAdmin'
import { CVsTable } from '../components/CVsTable'
import { CVsFilters } from '../components/CVsFilters'
import { CVPreviewModal } from '../components/CVPreviewModal'
import { Pagination } from '../components/Pagination'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import styles from './CVsAdminPage.module.css'

export function CVsAdminPage() {
  const {
    cvs,
    loading,
    pagination,
    filters,
    downloadCV: downloadCVService,
    getPreviewUrl,
    updateFilters,
    changePage,
  } = useCVsAdmin()

  const [selectedCV, setSelectedCV] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [cvToDownload, setCvToDownload] = useState(null)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Filtrar CVs localmente por búsqueda
  const filteredCVs = useMemo(() => {
    if (!searchTerm) return cvs

    const searchLower = searchTerm.toLowerCase()
    return cvs.filter((cv) => {
      const userName = (cv.user_name || '').toLowerCase()
      const userEmail = (cv.user_email || '').toLowerCase()
      const filename = (cv.original_filename || '').toLowerCase()
      const convocatoria = (cv.postulant_info?.job_posting_title || '').toLowerCase()

      return (
        userName.includes(searchLower) ||
        userEmail.includes(searchLower) ||
        filename.includes(searchLower) ||
        convocatoria.includes(searchLower)
      )
    })
  }, [cvs, searchTerm])

  const handlePreview = (cv) => {
    setSelectedCV(cv)
    setIsPreviewOpen(true)
  }

  const handleDownload = (cv) => {
    setCvToDownload(cv)
    setIsDownloadModalOpen(true)
  }

  const handleConfirmDownload = async () => {
    if (!cvToDownload) return
    
    setIsDownloading(true)
    try {
      await downloadCVService(cvToDownload.id, cvToDownload.original_filename)
      setIsDownloadModalOpen(false)
      setCvToDownload(null)
    } catch (error) {
      console.error('Error al descargar CV:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters)
  }

  const handleSearchChange = (term) => {
    setSearchTerm(term)
  }

  const previewUrl = selectedCV ? getPreviewUrl(selectedCV.id) : null

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <div>
              <h1 className={styles.title}>Gestión de CVs</h1>
              <p className={styles.subtitle}>
                Administra y visualiza los CVs de todos los postulantes
              </p>
            </div>
          </div>
          {pagination.total > 0 && (
            <div className={styles.stats}>
              <span className={styles.statNumber}>{pagination.total}</span>
              <span className={styles.statLabel}>CVs totales</span>
            </div>
          )}
        </div>
      </header>

      {/* Filtros */}
      <CVsFilters
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        filters={filters}
      />

      {/* Tabla de CVs */}
      <CVsTable
        cvs={filteredCVs}
        loading={loading}
        onPreview={handlePreview}
        onDownload={handleDownload}
      />

      {/* Paginación */}
      {!loading && filteredCVs.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={changePage}
        />
      )}

      {/* Modal de Previsualización */}
      <CVPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setSelectedCV(null)
        }}
        cv={selectedCV}
        previewUrl={previewUrl}
        onDownload={handleDownload}
      />

      {/* Modal de Confirmación de Descarga */}
      <ConfirmModal
        isOpen={isDownloadModalOpen}
        onClose={() => {
          if (!isDownloading) {
            setIsDownloadModalOpen(false)
            setCvToDownload(null)
          }
        }}
        onConfirm={handleConfirmDownload}
        title="Confirmar descarga"
        message={`¿Estás seguro de que deseas descargar el CV "${cvToDownload?.original_filename}"?`}
        confirmText="Descargar"
        cancelText="Cancelar"
        type="info"
        isLoading={isDownloading}
      />
    </div>
  )
}

