import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react'
import { Pagination } from 'antd'
import { Table } from '@shared/components/UI/Table'
import { PostulanteDetailModal } from '../components/PostulanteDetailModal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { usePostulantes } from '../hooks/usePostulantes'
import styles from './PostulantesPage.module.css'

/**
 * Mapea los datos de la API al formato esperado por los componentes
 */
const mapPostulanteFromAPI = (apiData) => {
  const personalData = apiData.personal_data || {}
  
  // Mapear estado basado en accepted y process_status
  let estado = 'Pendiente'
  if (apiData.accepted === true) {
    estado = 'Aceptado'
  } else if (apiData.accepted === false && apiData.process_status === 'rejected') {
    estado = 'Rechazado'
  }

  return {
    id: apiData.id,
    user_id: apiData.user_id,
    job_posting_id: apiData.job_posting_id,
    nombre: apiData.user_full_name || 
            `${apiData.user_name || ''} ${apiData.user_paternal_lastname || ''} ${apiData.user_maternal_lastname || ''}`.trim() || 
            'Sin nombre',
    correo: apiData.user_email || '',
    username: apiData.user_username || '',
    dni: apiData.user_document_number || personalData.document_number || '',
    documentType: apiData.user_document_type_name || '',
    telefono: apiData.user_phone || personalData.phone || '',
    direccion: personalData.address || '',
    fechaNacimiento: personalData.birth_date || '',
    sex: apiData.user_sex || personalData.sex || '',
    photoUrl: apiData.user_photo_url || '',
    etapa: apiData.current_stage || apiData.process_status || 'Postulación',
    processStatus: apiData.process_status || '',
    estado: estado,
    accepted: apiData.accepted,
    fecha: apiData.registration_date || apiData.created_at || new Date().toISOString(),
    lastUpdate: apiData.last_update_date || apiData.updated_at || '',
    // Ubicación
    country: apiData.user_country_name || '',
    region: apiData.user_region_name || '',
    province: apiData.user_province_name || '',
    district: apiData.user_district_name || personalData.district || '',
    // Datos personales adicionales
    specialty: personalData.specialty || null,
    career: personalData.career || '',
    semester: personalData.semester || '',
    experienceLevel: personalData.experience_level || '',
    // Estado de cuenta
    isActive: apiData.user_is_active,
    accountStatus: apiData.user_account_status || '',
    isEmailVerified: apiData.user_is_email_verified || false,
    // Datos originales de la API
    _apiData: apiData,
  }
}

export function PostulantesPage() {
  const [searchParams] = useSearchParams()
  const convocatoriaId = searchParams.get('convocatoria')
  
  const filters = {}
  if (convocatoriaId) {
    filters.job_posting_id = parseInt(convocatoriaId)
  }

  const { postulantes: apiPostulantes, loading, pagination, aceptarPostulante, rechazarPostulante, loadPostulantes } = usePostulantes(filters)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [postulanteToView, setPostulanteToView] = useState(null)
  const [postulanteToAction, setPostulanteToAction] = useState(null)
  const [actionType, setActionType] = useState(null) // 'aceptar' | 'rechazar'
  const [searchDebounce, setSearchDebounce] = useState(null)

  // Mapear postulantes de la API
  const postulantes = apiPostulantes.map(mapPostulanteFromAPI)

  const loadPostulantesWithFilters = (page = 1, page_size = pageSize) => {
    const params = { page, page_size, ...filters }
    if (searchTerm.trim()) {
      params.search = searchTerm.trim()
    }
    loadPostulantes(page, params)
  }

  useEffect(() => {
    loadPostulantesWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convocatoriaId])

  useEffect(() => {
    if (pagination.page_size && pagination.page_size !== pageSize) {
      setPageSize(pagination.page_size)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page_size])

  useEffect(() => {
    if (searchDebounce) clearTimeout(searchDebounce)
    const timeout = setTimeout(() => {
      loadPostulantesWithFilters(1, pageSize)
    }, searchTerm ? 500 : 0)
    setSearchDebounce(timeout)
    return () => { if (timeout) clearTimeout(timeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  useEffect(() => {
    loadPostulantesWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  const handleViewDetail = (postulante) => {
    setPostulanteToView(postulante)
    setIsDetailModalOpen(true)
  }

  const handleAceptar = (postulante) => {
    setPostulanteToAction(postulante)
    setActionType('aceptar')
    setIsConfirmModalOpen(true)
  }

  const handleRechazar = (postulante) => {
    setPostulanteToAction(postulante)
    setActionType('rechazar')
    setIsConfirmModalOpen(true)
  }

  const confirmAction = async () => {
    if (postulanteToAction) {
      try {
        if (actionType === 'aceptar') {
          await aceptarPostulante(postulanteToAction.id)
        } else if (actionType === 'rechazar') {
          await rechazarPostulante(postulanteToAction.id)
        }
        setPostulanteToAction(null)
        setActionType(null)
        loadPostulantesWithFilters(pagination.page, pagination.page_size)
      } catch (error) {
        // El error ya se maneja en el hook
      }
    }
    setIsConfirmModalOpen(false)
  }

  const handlePageChange = (page, size) => {
    const newPageSize = size || pageSize
    if (size && size !== pageSize) {
      setPageSize(newPageSize)
    }
    loadPostulantesWithFilters(page, newPageSize)
  }

  const getEtapaBadge = (etapa) => {
    return <span className={styles.badgeEtapa}>{etapa}</span>
  }

  const getEstadoBadge = (estado, accepted) => {
    if (estado === 'Aceptado' || accepted === true) {
      return <span className={styles.badgeEstadoCompleted}>Aceptado</span>
    }
    if (estado === 'Rechazado' || accepted === false) {
      return <span className={styles.badgeEstadoPending}>Rechazado</span>
    }
    return <span className={styles.badgeEstadoProgress}>Pendiente</span>
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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Postulantes</h1>
          <p className={styles.subtitle}>Administra todos los candidatos registrados</p>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className={styles.tableContainer}>
        <div className={styles.tableSection}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Correo</Table.HeaderCell>
                <Table.HeaderCell align="center">Etapa</Table.HeaderCell>
                <Table.HeaderCell align="center">Estado</Table.HeaderCell>
                <Table.HeaderCell align="center">Fecha</Table.HeaderCell>
                <Table.HeaderCell align="center" width="200px">Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Empty colSpan={6}>
                  Cargando postulantes...
                </Table.Empty>
              ) : postulantes.length > 0 ? (
                postulantes.map((postulante) => (
                  <Table.Row key={postulante.id}>
                    <Table.Cell>
                      <span className={styles.nombre}>{postulante.nombre}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.correo}>{postulante.correo}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getEtapaBadge(postulante.etapa)}
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getEstadoBadge(postulante.estado, postulante.accepted)}
                    </Table.Cell>
                    <Table.Cell align="center">
                      <span className={styles.fecha}>{formatDate(postulante.fecha)}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleViewDetail(postulante)}
                          className={styles.actionButtonView}
                          title="Ver Detalle"
                        >
                          <Eye size={16} />
                        </button>
                        {(postulante.estado === 'Pendiente' || postulante.accepted === null || postulante.accepted === undefined) && (
                          <>
                            <button
                              onClick={() => handleAceptar(postulante)}
                              className={styles.actionButton}
                              title="Aceptar"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleRechazar(postulante)}
                              className={styles.actionButtonDelete}
                              title="Rechazar"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Empty colSpan={6}>
                  {searchTerm
                    ? 'No se encontraron postulantes con ese criterio de búsqueda'
                    : 'No hay postulantes registrados'}
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
                if (total === 0) return 'Sin postulantes'
                return `${range[0]}-${range[1]} de ${total} postulantes`
              }}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              hideOnSinglePage={false}
            />
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      <PostulanteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setPostulanteToView(null)
        }}
        postulante={postulanteToView}
      />

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setPostulanteToAction(null)
          setActionType(null)
        }}
        onConfirm={confirmAction}
        title={actionType === 'aceptar' ? 'Aceptar Postulante' : 'Rechazar Postulante'}
        message={
          postulanteToAction
            ? `¿Seguro que deseas ${actionType === 'aceptar' ? 'aceptar' : 'rechazar'} a ${postulanteToAction.nombre}?`
            : `¿Seguro que deseas ${actionType === 'aceptar' ? 'aceptar' : 'rechazar'} este postulante?`
        }
        confirmText={actionType === 'aceptar' ? 'Aceptar' : 'Rechazar'}
        cancelText="Cancelar"
        type={actionType === 'aceptar' ? 'success' : 'danger'}
      />
    </div>
  )
}

