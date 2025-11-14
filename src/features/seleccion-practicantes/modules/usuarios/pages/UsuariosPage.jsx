import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, User, Mail, Shield, ShieldCheck, Eye } from 'lucide-react'
import { Pagination } from 'antd'
import { Table } from '@shared/components/UI/Table'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Select } from '@shared/components/Select'
import { useUsers } from '../../shared/hooks/useUsers'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { UserModal } from '../components/UserModal'
import { UserDetailModal } from '../components/UserDetailModal'
import styles from './UsuariosPage.module.css'

/**
 * Mapea los datos de la API al formato esperado por los componentes
 */
const mapUserFromAPI = (apiData) => {
  const roleMap = {
    1: 'Postulante',
    2: 'Administrador',
  }

  return {
    id: apiData.id,
    email: apiData.email || '',
    username: apiData.username || '',
    name: apiData.name || '',
    paternal_lastname: apiData.paternal_lastname || '',
    maternal_lastname: apiData.maternal_lastname || '',
    fullName: `${apiData.name || ''} ${apiData.paternal_lastname || ''} ${apiData.maternal_lastname || ''}`.trim() || 'Sin nombre',
    role: roleMap[apiData.role_id] || 'Desconocido',
    role_id: apiData.role_id,
    is_active: apiData.is_active !== undefined ? apiData.is_active : true,
    provider: apiData.provider || 'email',
    created_at: apiData.created_at || '',
    // Datos originales de la API
    _apiData: apiData,
  }
}

export function UsuariosPage() {
  const { users: apiUsers, loading, pagination, loadUsers, createUser, updateUser, deleteUser } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchDebounce, setSearchDebounce] = useState(null)

  // Función para cargar usuarios con filtros
  const loadUsersWithFilters = (page = 1, page_size = pageSize) => {
    const params = {
      page,
      page_size,
    }

    // Agregar filtros si existen
    if (searchTerm.trim()) {
      params.search = searchTerm.trim()
    }
    if (roleFilter) {
      params.role_id = roleFilter
    }
    if (statusFilter) {
      params.is_active = statusFilter === 'active'
    }

    loadUsers(params)
  }

  // Cargar usuarios al montar el componente (solo una vez)
  useEffect(() => {
    let mounted = true;
    
    const initialLoad = async () => {
      if (mounted) {
        await loadUsersWithFilters(1, pageSize);
      }
    };
    
    initialLoad();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo ejecutar una vez al montar

  // Cargar usuarios cuando cambian los filtros (con debounce para búsqueda)
  useEffect(() => {
    // Limpiar el timeout anterior
    if (searchDebounce) {
      clearTimeout(searchDebounce)
    }

    // Crear un nuevo timeout para la búsqueda
    const timeout = setTimeout(() => {
      loadUsersWithFilters(1, pageSize)
    }, searchTerm ? 500 : 0) // Debounce de 500ms solo para búsqueda

    setSearchDebounce(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter, statusFilter])

  // Cargar usuarios cuando cambia el tamaño de página
  useEffect(() => {
    loadUsersWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])
  
  // Sincronizar pageSize con pagination cuando cambia
  useEffect(() => {
    if (pagination.page_size && pagination.page_size !== pageSize) {
      setPageSize(pagination.page_size)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page_size])

  // Mapear usuarios de la API (ya vienen filtrados del servidor)
  const users = apiUsers.map(mapUserFromAPI)

  const handleCreate = () => {
    setSelectedUser(null)
    setIsEditing(false)
    setIsUserModalOpen(true)
  }

  const handleViewDetail = (user) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsEditing(true)
    setIsUserModalOpen(true)
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id)
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      // Recargar con los filtros actuales
      loadUsersWithFilters(pagination.page, pagination.page_size)
    }
  }

  const handleSaveUser = async (userData) => {
    if (isEditing && selectedUser) {
      await updateUser(selectedUser.id, userData, true)
    } else {
      await createUser(userData)
    }
    setIsUserModalOpen(false)
    setSelectedUser(null)
    setIsEditing(false)
    // Recargar con los filtros actuales
    loadUsersWithFilters(pagination.page, pagination.page_size)
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

  const getRoleBadge = (user) => {
    if (user.role_id === 2) {
      return (
        <div className={styles.roleBadgeAdmin}>
          <ShieldCheck size={14} />
          <span>{user.role}</span>
        </div>
      )
    }
    return (
      <div className={styles.roleBadgeUser}>
        <User size={14} />
        <span>{user.role}</span>
      </div>
    )
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
    loadUsersWithFilters(page, newPageSize)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <p className={styles.subtitle}>Administra los usuarios del sistema</p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          icon={Plus}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchAndFilters}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filtersRow}>
          <Select
            label="Rol"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los roles' },
              { value: '1', label: 'Postulante' },
              { value: '2', label: 'Administrador' },
            ]}
          />
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

      {/* Table and Pagination Container */}
      <div className={styles.tableContainer}>
        {/* Table */}
        <div className={styles.tableSection}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Usuario</Table.HeaderCell>
                <Table.HeaderCell align="center">Rol</Table.HeaderCell>
                <Table.HeaderCell align="center">Estado</Table.HeaderCell>
                <Table.HeaderCell>Proveedor</Table.HeaderCell>
                <Table.HeaderCell align="center">Fecha Registro</Table.HeaderCell>
                <Table.HeaderCell align="center" width="200px">Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Empty colSpan={7}>
                  Cargando usuarios...
                </Table.Empty>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className={styles.nombre}>{user.fullName}</span>
                          <div className={styles.correo}>{user.email}</div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.username}>{user.username}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getRoleBadge(user)}
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getStatusBadge(user.is_active)}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.providerBadge}>{user.provider}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.fecha}>{formatDate(user.created_at)}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleViewDetail(user)}
                          className={styles.actionButtonView}
                          title="Ver Detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
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
                <Table.Empty colSpan={7}>
                  {searchTerm || roleFilter || statusFilter
                    ? 'No se encontraron usuarios con ese criterio de búsqueda'
                    : 'No hay usuarios registrados'}
                </Table.Empty>
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination */}
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
                if (total === 0) return 'Sin usuarios'
                return `${range[0]}-${range[1]} de ${total} usuarios`
              }}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              hideOnSinglePage={false}
            />
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
      />

      {/* Modal de Crear/Editar */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false)
          setSelectedUser(null)
          setIsEditing(false)
        }}
        onSave={handleSaveUser}
        user={selectedUser}
        isEditing={isEditing}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.fullName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

