import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Eye, CheckCircle, XCircle, Download, FileSpreadsheet, Users } from 'lucide-react'
import { Pagination } from 'antd'
import { Table } from '@shared/components/UI/Table'
import { Select } from '@shared/components/Select'
import { PostulanteDetailModal } from '../components/PostulanteDetailModal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { usePostulantes } from '../hooks/usePostulantes'
import { generatePostulantePDF } from '../services/postulantePDFService'
import { generatePostulantesExcel } from '../services/postulanteExcelService'
import { getPostulantes } from '../services/postulanteService'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../shared/components/Skeleton'
import styles from './PostulantesPage.module.css'

/**
 * Mapea los datos de la API al formato esperado por los componentes
 */
const mapPostulanteFromAPI = (apiData) => {
  const personalData = apiData.personal_data || {}
  
  // Mapear estado basado en user_postulant_status (prioritario)
  // 1 = No aplicado, 2 = En proceso, 3 = Aceptado, 4 = Rechazado
  let estado = 'Pendiente'
  if (apiData.user_postulant_status === 3) {
    estado = 'Aceptado'
  } else if (apiData.user_postulant_status === 4) {
    estado = 'Rechazado'
  } else if (apiData.user_postulant_status === 2) {
    estado = 'En proceso'
  } else if (apiData.user_postulant_status === 1) {
    estado = 'No aplicado'
  } else {
    // Fallback a la lógica anterior si user_postulant_status no está disponible
    if (apiData.accepted === true || apiData.process_status === 'Accepted') {
      estado = 'Aceptado'
    } else if (apiData.accepted === false && (apiData.process_status === 'Rejected' || apiData.process_status === 'rejected')) {
      estado = 'Rechazado'
    }
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
    userPostulantStatus: apiData.user_postulant_status, // 1=No aplicado, 2=En proceso, 3=Aceptado, 4=Rechazado
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
    userRoleId: apiData.user_role_id,
    // Datos originales de la API
    _apiData: apiData,
  }
}

export function PostulantesPage() {
  const [searchParams] = useSearchParams()
  const convocatoriaId = searchParams.get('convocatoria')
  const toast = useToast()
  
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
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [searchDebounce, setSearchDebounce] = useState(null)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [downloadingExcel, setDownloadingExcel] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'accepted', 'rejected', 'pending'

  // Mapear postulantes de la API
  const allPostulantes = apiPostulantes.map(mapPostulanteFromAPI)

  // Filtrar postulantes según el estado seleccionado
  const postulantes = allPostulantes.filter(postulante => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'accepted') {
      // Aceptado: user_postulant_status === 3
      return postulante.userPostulantStatus === 3
    }
    if (statusFilter === 'rejected') {
      // Rechazado: user_postulant_status === 4
      return postulante.userPostulantStatus === 4
    }
    if (statusFilter === 'pending') {
      // Pendiente: user_postulant_status === 1 (No aplicado) o 2 (En proceso)
      return postulante.userPostulantStatus === 1 || postulante.userPostulantStatus === 2
    }
    return true
  })

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

  const handleDownloadPDF = async (postulante) => {
    try {
      setDownloadingPDF(true)
      await generatePostulantePDF(postulante)
      toast.success('PDF generado exitosamente')
    } catch (error) {
      console.error('Error al generar PDF:', error)
      toast.error('Error al generar el PDF. Por favor, intente nuevamente.')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true)
      toast.info('Cargando postulantes...')

      // Construir parámetros según el filtro
      const params = { ...filters }
      params.page_size = 1000 // Un número grande para obtener todos

      // Cargar todos los postulantes (sin paginación efectiva)
      let allPostulantesData = []
      let currentPage = 1
      let hasMore = true

      while (hasMore) {
        const response = await getPostulantes({ ...params, page: currentPage, page_size: 100 })
        const results = response.results || []
        allPostulantesData = [...allPostulantesData, ...results]
        
        // Verificar si hay más páginas
        const total = response.pagination?.total || response.total || 0
        hasMore = allPostulantesData.length < total && results.length === 100
        currentPage++
      }

      // Mapear postulantes
      const mappedPostulantes = allPostulantesData.map(mapPostulanteFromAPI)

      // Filtrar según el estado seleccionado (el mismo que se usa en la tabla)
      let filteredPostulantes = mappedPostulantes
      if (statusFilter === 'accepted') {
        // Aceptado: user_postulant_status === 3
        filteredPostulantes = mappedPostulantes.filter(p => p.userPostulantStatus === 3)
      } else if (statusFilter === 'rejected') {
        // Rechazado: user_postulant_status === 4
        filteredPostulantes = mappedPostulantes.filter(p => p.userPostulantStatus === 4)
      } else if (statusFilter === 'pending') {
        // Pendiente: user_postulant_status === 1 (No aplicado) o 2 (En proceso)
        filteredPostulantes = mappedPostulantes.filter(p => 
          p.userPostulantStatus === 1 || p.userPostulantStatus === 2
        )
      }

      if (filteredPostulantes.length === 0) {
        toast.warning('No hay postulantes para exportar con el filtro seleccionado')
        return
      }

      // Generar Excel con los mismos datos que se muestran en la tabla
      await generatePostulantesExcel(filteredPostulantes, statusFilter)
      toast.success(`Excel generado exitosamente con ${filteredPostulantes.length} postulante(s)`)
    } catch (error) {
      console.error('Error al generar Excel:', error)
      toast.error('Error al generar el Excel. Por favor, intente nuevamente.')
    } finally {
      setDownloadingExcel(false)
    }
  }

  const confirmAction = async () => {
    if (postulanteToAction && !isActionLoading) {
      setIsActionLoading(true)
      try {
        if (actionType === 'aceptar') {
          await aceptarPostulante(postulanteToAction.id)
          // El hook ya recarga la lista automáticamente y muestra toast de éxito
        } else if (actionType === 'rechazar') {
          await rechazarPostulante(postulanteToAction.id)
          // El hook ya recarga la lista automáticamente y muestra toast de éxito
        }
        setPostulanteToAction(null)
        setActionType(null)
        setIsConfirmModalOpen(false)
      } catch (error) {
        // El error ya se maneja en el hook con toast
        // No cerrar el modal si hay error para que el usuario pueda intentar nuevamente
        console.error('Error en confirmAction:', error)
      } finally {
        setIsActionLoading(false)
      }
    }
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

  const getEstadoBadge = (estado, accepted, userPostulantStatus) => {
    // Usar SOLO user_postulant_status como fuente de verdad
    // 1 = No aplicado, 2 = En proceso, 3 = Aceptado, 4 = Rechazado
    if (userPostulantStatus === 3) {
      return <span className={styles.badgeEstadoCompleted}>Aceptado</span>
    }
    if (userPostulantStatus === 4) {
      return <span className={styles.badgeEstadoPending}>Rechazado</span>
    }
    if (userPostulantStatus === 2) {
      return <span className={styles.badgeEstadoEnProceso}>En proceso</span>
    }
    if (userPostulantStatus === 1) {
      return <span className={styles.badgeEstadoNoAplicado}>No aplicado</span>
    }
    // Fallback solo si userPostulantStatus no está disponible
    if (estado === 'Rechazado' || accepted === false) {
      return <span className={styles.badgeEstadoPending}>Rechazado</span>
    }
    if (estado === 'Aceptado' || accepted === true) {
      return <span className={styles.badgeEstadoCompleted}>Aceptado</span>
    }
    // Por defecto: Pendiente
    return <span className={styles.badgeEstadoNoAplicado}>Pendiente</span>
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
        <div className={styles.searchAndDownload}>
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
          <div className={styles.downloadSection}>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                // Resetear a la primera página cuando cambia el filtro
                loadPostulantesWithFilters(1, pageSize)
              }}
              options={[
                { value: 'all', label: 'Todos los postulantes' },
                { value: 'accepted', label: 'Aceptados' },
                { value: 'rejected', label: 'Rechazados' },
                { value: 'pending', label: 'En Proceso' }
              ]}
              className={styles.filterSelect}
              fullWidth={false}
              disabled={downloadingExcel || loading}
            />
            <button
              onClick={handleDownloadExcel}
              className={styles.downloadExcelButton}
              disabled={downloadingExcel}
              title="Descargar Excel"
            >
              <FileSpreadsheet size={18} />
              {downloadingExcel ? 'Generando...' : 'Descargar Excel'}
            </button>
          </div>
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
                <Table.HeaderCell align="center" width="240px">Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Table.Row key={i}>
                      <Table.Cell><Skeleton variant="text" width="80%" height={16} /></Table.Cell>
                      <Table.Cell><Skeleton variant="text" width="70%" height={16} /></Table.Cell>
                      <Table.Cell align="center"><Skeleton variant="rectangular" width={80} height={24} /></Table.Cell>
                      <Table.Cell align="center"><Skeleton variant="rectangular" width={90} height={24} /></Table.Cell>
                      <Table.Cell align="center"><Skeleton variant="text" width="60%" height={16} /></Table.Cell>
                      <Table.Cell align="center"><Skeleton variant="rectangular" width={120} height={32} /></Table.Cell>
                    </Table.Row>
                  ))}
                </>
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
                      {getEstadoBadge(postulante.estado, postulante.accepted, postulante.userPostulantStatus)}
                    </Table.Cell>
                    <Table.Cell align="center">
                      <span className={styles.fecha}>{formatDate(postulante.fecha)}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleViewDetail(postulante)}
                          className={styles.actionButtonView}
                          title="Ver detalles completos del postulante"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(postulante)}
                          className={styles.actionButtonDownload}
                          title="Descargar información del postulante en formato PDF"
                          disabled={downloadingPDF}
                        >
                          <Download size={16} />
                        </button>
                        {/* Mostrar botones solo si user_postulant_status es 1 (No aplicado) o 2 (En proceso) */}
                        {(postulante.userPostulantStatus === 1 || postulante.userPostulantStatus === 2) && (
                          <>
                            <button
                              onClick={() => handleAceptar(postulante)}
                              className={styles.actionButton}
                              title="Aceptar postulante - Cambiará el estado del usuario a 'Aceptado' (user_postulant_status: 3)"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleRechazar(postulante)}
                              className={styles.actionButtonDelete}
                              title="Rechazar postulante - Cambiará el estado del usuario a 'Rechazado' (user_postulant_status: 4)"
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
                <Table.Empty
                  colSpan={6}
                  icon={Users}
                  colorPreset="dark"
                  title={searchTerm ? 'Sin coincidencias' : 'No hay postulantes registrados'}
                  description={
                    searchTerm
                      ? 'Intenta con otro nombre, correo o limpia los filtros.'
                      : 'Cuando se registren postulantes, los verás en esta tabla.'
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
          if (!isActionLoading) {
            setIsConfirmModalOpen(false)
            setPostulanteToAction(null)
            setActionType(null)
          }
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
        isLoading={isActionLoading}
      />
    </div>
  )
}

