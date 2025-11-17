import { useState } from 'react'
import { DocumentList } from '../components/DocumentList'
import { DocumentActions } from '../components/DocumentActions'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { useFiles } from '../hook/useFiles'
import { SkeletonList } from '../../../shared/components/Skeleton'
import styles from './CVsPage.module.css'

/**
 * Mapea los datos de la API al formato esperado por los componentes
 */
const mapDocumentFromAPI = (apiData) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileExtension = (filename) => {
    if (!filename) return 'PDF'
    const ext = filename.split('.').pop().toUpperCase()
    return ext || 'PDF'
  }

  return {
    id: apiData.id,
    titulo: apiData.filename || 'Documento sin nombre',
    postulante: 'Usuario', // Se puede obtener del contexto de usuario
    fecha: apiData.uploaded_at || new Date().toISOString(),
    tamaño: formatFileSize(apiData.file_size),
    tipo: getFileExtension(apiData.filename),
    url: apiData.file_url || '',
    // Datos originales de la API
    _apiData: apiData,
  }
}

export function CVsPage() {
  const { files: apiFiles, loading, downloadFile, deleteFile } = useFiles()
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Mapear documentos de la API
  const documents = apiFiles.map(mapDocumentFromAPI)

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.postulante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectDocument = (document) => {
    setSelectedDocument(document)
  }

  const handleDownload = () => {
    if (selectedDocument) {
      setIsDownloadModalOpen(true)
    }
  }

  const confirmDownload = async () => {
    if (selectedDocument) {
      try {
        await downloadFile(selectedDocument.id)
        setIsDownloadModalOpen(false)
      } catch (error) {
        // El error ya se maneja en el hook
      }
    }
  }

  const handleViewFull = () => {
    if (selectedDocument && selectedDocument.url) {
      window.open(selectedDocument.url, '_blank')
    }
  }

  const handlePrint = () => {
    if (selectedDocument && selectedDocument.url) {
      const printWindow = window.open(selectedDocument.url, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    }
  }

  const handleDelete = () => {
    if (selectedDocument) {
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (selectedDocument) {
      try {
        await deleteFile(selectedDocument.id)
        setSelectedDocument(null)
        setIsDeleteModalOpen(false)
      } catch (error) {
        // El error ya se maneja en el hook
      }
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Ver CVs y Documentos</h1>
          <p className={styles.subtitle}>
            Visualiza y descarga documentos de los postulantes
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Panel de Documentos (Izquierda) */}
        <div className={styles.documentsPanel}>
          {loading ? (
            <SkeletonList items={5} />
          ) : (
            <DocumentList
              documents={filteredDocuments}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDocument={selectedDocument}
              onSelectDocument={handleSelectDocument}
            />
          )}
        </div>

        {/* Panel de Acciones (Derecha) */}
        <div className={styles.actionsPanel}>
          <DocumentActions
            onDownload={handleDownload}
            onViewFull={handleViewFull}
            onPrint={handlePrint}
            onDelete={handleDelete}
            hasSelection={!!selectedDocument}
          />
        </div>
      </div>

      {/* Modal de Confirmación para Descarga */}
      <ConfirmModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onConfirm={confirmDownload}
        title="Confirmar Descarga"
        message={
          selectedDocument
            ? `¿Deseas descargar "${selectedDocument.titulo}"?`
            : '¿Deseas descargar este documento?'
        }
        confirmText="Descargar"
        cancelText="Cancelar"
        type="info"
      />

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Documento"
        message={
          selectedDocument
            ? `¿Seguro que deseas eliminar "${selectedDocument.titulo}"? Esta acción no se puede deshacer.`
            : '¿Seguro que deseas eliminar este documento?'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}


