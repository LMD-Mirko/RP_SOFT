import { useState } from 'react'
import { DocumentList } from '../components/DocumentList'
import { DocumentActions } from '../components/DocumentActions'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { useToast } from '@shared/components/Toast'
import styles from './CVsPage.module.css'

// Datos mock para demostración
const mockDocuments = [
  {
    id: 1,
    titulo: 'CV - Juan Pérez',
    postulante: 'Juan Pérez',
    fecha: '2025-01-15',
    tamaño: '2.4 MB',
    tipo: 'PDF',
    url: '#',
  },
  {
    id: 2,
    titulo: 'CV - María García',
    postulante: 'María García',
    fecha: '2025-01-15',
    tamaño: '1.8 MB',
    tipo: 'PDF',
    url: '#',
  },
  {
    id: 3,
    titulo: 'Portafolio - Carlos López',
    postulante: 'Carlos López',
    fecha: '2025-01-14',
    tamaño: '5.2 MB',
    tipo: 'PDF',
    url: '#',
  },
  {
    id: 4,
    titulo: 'CV - Ana Rodríguez',
    postulante: 'Ana Rodríguez',
    fecha: '2025-01-13',
    tamaño: '2.1 MB',
    tipo: 'PDF',
    url: '#',
  },
]

export function CVsPage() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const toast = useToast()

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
    } else {
      toast.warning('Por favor selecciona un documento primero')
    }
  }

  const confirmDownload = () => {
    if (selectedDocument) {
      // Simular descarga
      toast.success(`Descargando ${selectedDocument.titulo}...`)
      setIsDownloadModalOpen(false)
      // Aquí iría la lógica real de descarga
    }
  }

  const handleViewFull = () => {
    if (selectedDocument) {
      toast.info(`Abriendo ${selectedDocument.titulo} en nueva ventana...`)
      // Aquí iría la lógica para abrir el documento completo
      window.open(selectedDocument.url, '_blank')
    } else {
      toast.warning('Por favor selecciona un documento primero')
    }
  }

  const handlePrint = () => {
    if (selectedDocument) {
      toast.info(`Imprimiendo ${selectedDocument.titulo}...`)
      // Aquí iría la lógica para imprimir
      window.print()
    } else {
      toast.warning('Por favor selecciona un documento primero')
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
          <DocumentList
            documents={filteredDocuments}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDocument={selectedDocument}
            onSelectDocument={handleSelectDocument}
          />
        </div>

        {/* Panel de Acciones (Derecha) */}
        <div className={styles.actionsPanel}>
          <DocumentActions
            onDownload={handleDownload}
            onViewFull={handleViewFull}
            onPrint={handlePrint}
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
    </div>
  )
}


