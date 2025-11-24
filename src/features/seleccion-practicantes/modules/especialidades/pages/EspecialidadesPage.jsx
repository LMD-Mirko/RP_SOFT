import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, GraduationCap, Eye } from 'lucide-react'
import { Pagination } from 'antd'
import { Table } from '@shared/components/UI/Table'
import { Button } from '@shared/components/Button'
import { Select } from '@shared/components/Select'
import { useSpecialties } from '../../shared/hooks/useSpecialties'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { SpecialtyModal } from '../components/SpecialtyModal'
import { SpecialtyDetailModal } from '../components/SpecialtyDetailModal'
import { Skeleton } from '../../../shared/components/Skeleton'
import styles from './EspecialidadesPage.module.css'

export function EspecialidadesPage() {
  const { specialties, loading, pagination, loadSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } = useSpecialties()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchDebounce, setSearchDebounce] = useState(null)

  const loadSpecialtiesWithFilters = (page = 1, page_size = pageSize) => {
    const params = { page, page_size }
    if (searchTerm.trim()) params.search = searchTerm.trim()
    if (statusFilter) params.is_active = statusFilter === 'active'
    loadSpecialties(params)
  }

  useEffect(() => {
    loadSpecialtiesWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchDebounce) clearTimeout(searchDebounce)
    const timeout = setTimeout(() => {
      loadSpecialtiesWithFilters(1, pageSize)
    }, searchTerm ? 500 : 0)
    setSearchDebounce(timeout)
    return () => { if (timeout) clearTimeout(timeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter])

  useEffect(() => {
    loadSpecialtiesWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  useEffect(() => {
    if (pagination.page_size && pagination.page_size !== pageSize) {
      setPageSize(pagination.page_size)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page_size])

  const handleCreate = () => {
    setSelectedSpecialty(null)
    setIsEditing(false)
    setIsSpecialtyModalOpen(true)
  }

  const handleViewDetail = (specialty) => {
    setSelectedSpecialty(specialty)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (specialty) => {
    setSelectedSpecialty(specialty)
    setIsEditing(true)
    setIsSpecialtyModalOpen(true)
  }

  const handleDelete = (specialty) => {
    setSelectedSpecialty(specialty)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedSpecialty) {
      await deleteSpecialty(selectedSpecialty.id)
      setIsDeleteModalOpen(false)
      setSelectedSpecialty(null)
      loadSpecialtiesWithFilters(pagination.page, pagination.page_size)
    }
  }

  const handleSaveSpecialty = async (specialtyData) => {
    if (isEditing && selectedSpecialty) {
      await updateSpecialty(selectedSpecialty.id, specialtyData, true)
    } else {
      await createSpecialty(specialtyData)
    }
    setIsSpecialtyModalOpen(false)
    setSelectedSpecialty(null)
    setIsEditing(false)
    loadSpecialtiesWithFilters(pagination.page, pagination.page_size)
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
    loadSpecialtiesWithFilters(page, newPageSize)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Especialidades</h1>
          <p className={styles.subtitle}>Administra las especialidades del sistema</p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          icon={Plus}
        >
          Nueva Especialidad
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
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Table.Row key={i}>
                      <Table.Cell>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <Skeleton variant="rectangular" width={20} height={20} />
                          <Skeleton variant="text" width="60%" height={16} />
                        </div>
                      </Table.Cell>
                      <Table.Cell><Skeleton variant="text" width="80%" height={16} /></Table.Cell>
                      <Table.Cell align="center"><Skeleton variant="rectangular" width={80} height={24} /></Table.Cell>
                      <Table.Cell align="center"><Skeleton variant="text" width="60%" height={16} /></Table.Cell>
                      <Table.Cell align="center">
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Skeleton variant="rectangular" width={32} height={32} />
                          <Skeleton variant="rectangular" width={32} height={32} />
                          <Skeleton variant="rectangular" width={32} height={32} />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </>
              ) : specialties.length > 0 ? (
                specialties.map((specialty) => (
                  <Table.Row key={specialty.id}>
                    <Table.Cell>
                      <div className={styles.specialtyCell}>
                        <GraduationCap size={20} className={styles.specialtyIcon} />
                        <span className={styles.specialtyName}>{specialty.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.description}>{specialty.description || '-'}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getStatusBadge(specialty.is_active)}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.fecha}>{formatDate(specialty.created_at)}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleViewDetail(specialty)}
                          className={styles.actionButtonView}
                          title="Ver Detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(specialty)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(specialty)}
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
                <Table.Empty
                  colSpan={5}
                  icon={GraduationCap}
                  colorPreset="dark"
                  title={searchTerm || statusFilter ? 'Sin resultados' : 'No hay especialidades registradas'}
                  description={
                    searchTerm || statusFilter
                      ? 'Ajusta los filtros o busca por otro término.'
                      : 'Crea una especialidad para comenzar a administrarla.'
                  }
                />
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
                if (total === 0) return 'Sin especialidades'
                return `${range[0]}-${range[1]} de ${total} especialidades`
              }}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              hideOnSinglePage={false}
            />
          </div>
        )}
      </div>

      <SpecialtyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedSpecialty(null)
        }}
        specialty={selectedSpecialty}
      />

      <SpecialtyModal
        isOpen={isSpecialtyModalOpen}
        onClose={() => {
          setIsSpecialtyModalOpen(false)
          setSelectedSpecialty(null)
          setIsEditing(false)
        }}
        onSave={handleSaveSpecialty}
        specialty={selectedSpecialty}
        isEditing={isEditing}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedSpecialty(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Especialidad"
        message={`¿Estás seguro de que deseas eliminar la especialidad "${selectedSpecialty?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

