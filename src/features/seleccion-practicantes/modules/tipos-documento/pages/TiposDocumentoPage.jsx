import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, FileText, Eye } from 'lucide-react'
import { Pagination } from 'antd'
import { Table } from '@shared/components/UI/Table'
import { Button } from '@shared/components/Button'
import { Select } from '@shared/components/Select'
import { useDocumentTypes } from '../../shared/hooks/useDocumentTypes'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { DocumentTypeModal } from '../components/DocumentTypeModal'
import { DocumentTypeDetailModal } from '../components/DocumentTypeDetailModal'
import styles from './TiposDocumentoPage.module.css'

export function TiposDocumentoPage() {
  const { documentTypes, loading, pagination, loadDocumentTypes, createDocumentType, updateDocumentType, deleteDocumentType } = useDocumentTypes()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [isDocumentTypeModalOpen, setIsDocumentTypeModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchDebounce, setSearchDebounce] = useState(null)

  const loadDocumentTypesWithFilters = (page = 1, page_size = pageSize) => {
    const params = { page, page_size }
    if (searchTerm.trim()) params.search = searchTerm.trim()
    if (statusFilter) params.is_active = statusFilter === 'active'
    loadDocumentTypes(params)
  }

  useEffect(() => {
    loadDocumentTypesWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchDebounce) clearTimeout(searchDebounce)
    const timeout = setTimeout(() => {
      loadDocumentTypesWithFilters(1, pageSize)
    }, searchTerm ? 500 : 0)
    setSearchDebounce(timeout)
    return () => { if (timeout) clearTimeout(timeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter])

  useEffect(() => {
    loadDocumentTypesWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  useEffect(() => {
    if (pagination.page_size && pagination.page_size !== pageSize) {
      setPageSize(pagination.page_size)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page_size])

  const handleCreate = () => {
    setSelectedDocumentType(null)
    setIsEditing(false)
    setIsDocumentTypeModalOpen(true)
  }

  const handleViewDetail = (documentType) => {
    setSelectedDocumentType(documentType)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (documentType) => {
    setSelectedDocumentType(documentType)
    setIsEditing(true)
    setIsDocumentTypeModalOpen(true)
  }

  const handleDelete = (documentType) => {
    setSelectedDocumentType(documentType)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedDocumentType) {
      await deleteDocumentType(selectedDocumentType.id)
      setIsDeleteModalOpen(false)
      setSelectedDocumentType(null)
      loadDocumentTypesWithFilters(pagination.page, pagination.page_size)
    }
  }

  const handleSaveDocumentType = async (documentTypeData) => {
    if (isEditing && selectedDocumentType) {
      await updateDocumentType(selectedDocumentType.id, documentTypeData, true)
    } else {
      await createDocumentType(documentTypeData)
    }
    setIsDocumentTypeModalOpen(false)
    setSelectedDocumentType(null)
    setIsEditing(false)
    loadDocumentTypesWithFilters(pagination.page, pagination.page_size)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <span className={styles.badgeEstadoCompleted}>Activo</span>
    }
    return <span className={styles.badgeEstadoPending}>Inactivo</span>
  }

  const handlePageChange = (page, size) => {
    const newPageSize = size || pageSize
    if (size && size !== pageSize) {
      setPageSize(newPageSize)
    }
    loadDocumentTypesWithFilters(page, newPageSize)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Tipos de Documento</h1>
          <p className={styles.subtitle}>Administra los tipos de documento del sistema</p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          icon={Plus}
        >
          Nuevo Tipo de Documento
        </Button>
      </div>

      <div className={styles.searchAndFilters}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filtersRow}>
          <Select
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
            ]}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableSection}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Descripción</Table.HeaderCell>
                <Table.HeaderCell align="center">Estado</Table.HeaderCell>
                <Table.HeaderCell align="center">Fecha Creación</Table.HeaderCell>
                <Table.HeaderCell align="center" width="200px">Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Empty colSpan={5}>
                  Cargando tipos de documento...
                </Table.Empty>
              ) : documentTypes.length > 0 ? (
                documentTypes.map((documentType) => (
                  <Table.Row key={documentType.id}>
                    <Table.Cell>
                      <div className={styles.documentTypeCell}>
                        <FileText size={20} className={styles.documentTypeIcon} />
                        <span className={styles.documentTypeName}>{documentType.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.description}>{documentType.description || '-'}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getStatusBadge(documentType.is_active)}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.fecha}>{formatDate(documentType.created_at)}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleViewDetail(documentType)}
                          className={styles.actionButtonView}
                          title="Ver Detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(documentType)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(documentType)}
                          className={styles.actionButtonDelete}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Empty colSpan={5}>
                  {searchTerm || statusFilter
                    ? 'No se encontraron tipos de documento con ese criterio de búsqueda'
                    : 'No hay tipos de documento registrados'}
                </Table.Empty>
              )}
            </Table.Body>
          </Table>
        </div>

        {!loading && pagination.total > 0 && (
          <div className={styles.pagination}>
            <Pagination
              current={pagination.page || 1}
              total={pagination.total || 0}
              pageSize={pagination.page_size || 20}
              pageSizeOptions={['10', '20', '30', '50', '100']}
              showSizeChanger={true}
              showQuickJumper={pagination.total > 50}
              showTotal={(total, range) => {
                if (total === 0) return 'Sin tipos de documento'
                return `${range[0]}-${range[1]} de ${total} tipos de documento`
              }}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              hideOnSinglePage={false}
            />
          </div>
        )}
      </div>

      <DocumentTypeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedDocumentType(null)
        }}
        documentType={selectedDocumentType}
      />

      <DocumentTypeModal
        isOpen={isDocumentTypeModalOpen}
        onClose={() => {
          setIsDocumentTypeModalOpen(false)
          setSelectedDocumentType(null)
          setIsEditing(false)
        }}
        onSave={handleSaveDocumentType}
        documentType={selectedDocumentType}
        isEditing={isEditing}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedDocumentType(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Tipo de Documento"
        message={`¿Estás seguro de que deseas eliminar el tipo de documento "${selectedDocumentType?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

