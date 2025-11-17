import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Shield, Eye } from 'lucide-react'
import { Pagination } from 'antd'
import { Table } from '@shared/components/UI/Table'
import { Button } from '@shared/components/Button'
import { Select } from '@shared/components/Select'
import { useRoles } from '../../shared/hooks/useRoles'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { RoleModal } from '../components/RoleModal'
import { RoleDetailModal } from '../components/RoleDetailModal'
import { Skeleton } from '../../../shared/components/Skeleton'
import styles from './RolesPage.module.css'

export function RolesPage() {
  const { roles, loading, pagination, loadRoles, createRole, updateRole, deleteRole } = useRoles()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchDebounce, setSearchDebounce] = useState(null)

  const loadRolesWithFilters = (page = 1, page_size = pageSize) => {
    const params = { page, page_size }
    if (searchTerm.trim()) params.search = searchTerm.trim()
    if (statusFilter) params.is_active = statusFilter === 'active'
    loadRoles(params)
  }

  useEffect(() => {
    loadRolesWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchDebounce) clearTimeout(searchDebounce)
    const timeout = setTimeout(() => {
      loadRolesWithFilters(1, pageSize)
    }, searchTerm ? 500 : 0)
    setSearchDebounce(timeout)
    return () => { if (timeout) clearTimeout(timeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter])

  useEffect(() => {
    loadRolesWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  useEffect(() => {
    if (pagination.page_size && pagination.page_size !== pageSize) {
      setPageSize(pagination.page_size)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page_size])

  const handleCreate = () => {
    setSelectedRole(null)
    setIsEditing(false)
    setIsRoleModalOpen(true)
  }

  const handleViewDetail = (role) => {
    setSelectedRole(role)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (role) => {
    setSelectedRole(role)
    setIsEditing(true)
    setIsRoleModalOpen(true)
  }

  const handleDelete = (role) => {
    setSelectedRole(role)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedRole) {
      await deleteRole(selectedRole.id)
      setIsDeleteModalOpen(false)
      setSelectedRole(null)
      loadRolesWithFilters(pagination.page, pagination.page_size)
    }
  }

  const handleSaveRole = async (roleData) => {
    if (isEditing && selectedRole) {
      await updateRole(selectedRole.id, roleData, true)
    } else {
      await createRole(roleData)
    }
    setIsRoleModalOpen(false)
    setSelectedRole(null)
    setIsEditing(false)
    loadRolesWithFilters(pagination.page, pagination.page_size)
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
    loadRolesWithFilters(page, newPageSize)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Roles</h1>
          <p className={styles.subtitle}>Administra los roles del sistema</p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          icon={Plus}
        >
          Nuevo Rol
        </Button>
      </div>

      <div className={styles.searchAndFilters}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre o slug..."
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
                <Table.HeaderCell>Slug</Table.HeaderCell>
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
                      <Table.Cell><Skeleton variant="text" width="50%" height={16} /></Table.Cell>
                      <Table.Cell><Skeleton variant="text" width="70%" height={16} /></Table.Cell>
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
              ) : roles.length > 0 ? (
                roles.map((role) => (
                  <Table.Row key={role.id}>
                    <Table.Cell>
                      <div className={styles.roleCell}>
                        <Shield size={20} className={styles.roleIcon} />
                        <span className={styles.roleName}>{role.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.slug}>{role.slug}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.description}>{role.description || '-'}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getStatusBadge(role.is_active)}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.fecha}>{formatDate(role.created_at)}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleViewDetail(role)}
                          className={styles.actionButtonView}
                          title="Ver Detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(role)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(role)}
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
                <Table.Empty colSpan={6}>
                  {searchTerm || statusFilter
                    ? 'No se encontraron roles con ese criterio de búsqueda'
                    : 'No hay roles registrados'}
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
                if (total === 0) return 'Sin roles'
                return `${range[0]}-${range[1]} de ${total} roles`
              }}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              hideOnSinglePage={false}
            />
          </div>
        )}
      </div>

      <RoleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedRole(null)
        }}
        role={selectedRole}
      />

      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false)
          setSelectedRole(null)
          setIsEditing(false)
        }}
        onSave={handleSaveRole}
        role={selectedRole}
        isEditing={isEditing}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedRole(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${selectedRole?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

