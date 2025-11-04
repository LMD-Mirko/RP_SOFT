import { Search, FileText } from 'lucide-react'
import { Input } from '@shared/components/Input'
import styles from './DocumentList.module.css'
import clsx from 'clsx'

export function DocumentList({
  documents,
  searchTerm,
  onSearchChange,
  selectedDocument,
  onSelectDocument,
}) {
  return (
    <div className={styles.container}>
      {/* Barra de Búsqueda */}
      <div className={styles.searchContainer}>
        <Input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
          iconPosition="left"
        />
      </div>

      {/* Lista de Documentos */}
      <div className={styles.listContainer}>
        {documents.length > 0 ? (
          documents.map((document) => (
            <div
              key={document.id}
              className={clsx(
                styles.documentItem,
                selectedDocument?.id === document.id && styles.selected
              )}
              onClick={() => onSelectDocument(document)}
            >
              <div className={styles.documentIcon}>
                <FileText size={24} />
              </div>

              <div className={styles.documentInfo}>
                <h3 className={styles.documentTitle}>{document.titulo}</h3>
                <p className={styles.postulanteName}>{document.postulante}</p>
                <p className={styles.documentDate}>{document.fecha}</p>
              </div>

              <div className={styles.documentDetails}>
                <span className={styles.fileSize}>{document.tamaño}</span>
                <span className={styles.fileType}>{document.tipo}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {searchTerm
                ? `No se encontraron documentos para "${searchTerm}"`
                : 'No hay documentos disponibles'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


