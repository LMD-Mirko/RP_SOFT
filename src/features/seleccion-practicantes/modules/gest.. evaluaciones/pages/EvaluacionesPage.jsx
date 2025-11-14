import { useState, useEffect } from 'react'
import { Search, Award, Eye, Trash2 } from 'lucide-react'
import { Pagination } from 'antd'
import { Table } from '@shared/components/UI/Table'
import { Select } from '@shared/components/Select'
import { Button } from '@shared/components/Button'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { useEvaluaciones } from '../hooks/useEvaluaciones'
import { usePostulantes } from '../../postulantes/hooks/usePostulantes'
import { useToast } from '@shared/components/Toast'
import styles from './EvaluacionesPage.module.css'

const mapAttemptFromAPI = (apiData) => {
  return {
    id: apiData.id,
    postulante: apiData.postulant?.name 
      ? `${apiData.postulant.name} ${apiData.postulant.paternal_lastname || ''} ${apiData.postulant.maternal_lastname || ''}`.trim()
      : apiData.postulant?.email || 'N/A',
    postulanteId: apiData.postulant?.id,
    evaluation: apiData.evaluation?.title || 'N/A',
    evaluationId: apiData.evaluation_id,
    puntaje: apiData.score,
    estado: apiData.status === 'completed' ? 'completada' : apiData.status === 'in_progress' ? 'en_progreso' : 'pendiente',
    startedAt: apiData.started_at,
    completedAt: apiData.completed_at,
    _apiData: apiData,
  }
}

export function EvaluacionesPage() {
  const { evaluaciones: apiAttempts, loading, pagination, loadEvaluaciones, deleteEvaluacion } = useEvaluaciones()
  const { postulantes, loadPostulantes } = usePostulantes()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAttempt, setSelectedAttempt] = useState(null)
  const [searchDebounce, setSearchDebounce] = useState(null)
  const toast = useToast()

  const loadAttemptsWithFilters = (page = 1, page_size = pageSize) => {
    const params = { page, page_size }
    if (statusFilter) params.status = statusFilter
    if (searchTerm.trim()) params.search = searchTerm.trim()
    loadEvaluaciones(params)
  }

  useEffect(() => {
    loadAttemptsWithFilters(1, pageSize)
    loadPostulantes(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchDebounce) clearTimeout(searchDebounce)
    const timeout = setTimeout(() => {
      loadAttemptsWithFilters(1, pageSize)
    }, searchTerm ? 500 : 0)
    setSearchDebounce(timeout)
    return () => { if (timeout) clearTimeout(timeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter])

  useEffect(() => {
    loadAttemptsWithFilters(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  useEffect(() => {
    if (pagination.page_size && pagination.page_size !== pageSize) {
      setPageSize(pagination.page_size)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page_size])

  const handleDelete = (attempt) => {
    setSelectedAttempt(attempt)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedAttempt) {
      await deleteEvaluacion(selectedAttempt.id)
      setIsDeleteModalOpen(false)
      setSelectedAttempt(null)
      loadAttemptsWithFilters(pagination.page, pagination.page_size)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getEstadoBadge = (estado) => {
    if (estado === 'completada') {
      return <span className={styles.badgeCompleted}>Completado</span>
    }
    if (estado === 'en_progreso') {
      return <span className={styles.badgeInProgress}>En Progreso</span>
    }
    return <span className={styles.badgePending}>Pendiente</span>
  }

  const handlePageChange = (page, size) => {
    const newPageSize = size || pageSize
    if (size && size !== pageSize) {
      setPageSize(newPageSize)
    }
    loadAttemptsWithFilters(page, newPageSize)
  }

  const attempts = apiAttempts.map(mapAttemptFromAPI)

  const postulantesOptions = postulantes.map(p => ({
    value: p.id?.toString() || '',
    label: `${p.name || ''} ${p.paternal_lastname || ''} ${p.maternal_lastname || ''}`.trim() || p.email || 'N/A'
  }))

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Evaluaciones</h1>
          <p className={styles.subtitle}>Gestiona los intentos de evaluación de los postulantes</p>
        </div>
      </div>

      <div className={styles.searchAndFilters}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por postulante o evaluación..."
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
              { value: 'completed', label: 'Completado' },
              { value: 'in_progress', label: 'En Progreso' },
              { value: 'pending', label: 'Pendiente' },
            ]}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableSection}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Postulante</Table.HeaderCell>
                <Table.HeaderCell>Evaluación</Table.HeaderCell>
                <Table.HeaderCell align="center">Puntaje</Table.HeaderCell>
                <Table.HeaderCell align="center">Estado</Table.HeaderCell>
                <Table.HeaderCell align="center">Fecha Inicio</Table.HeaderCell>
                <Table.HeaderCell align="center">Fecha Fin</Table.HeaderCell>
                <Table.HeaderCell align="center" width="120px">Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Empty colSpan={7}>
                  Cargando evaluaciones...
                </Table.Empty>
              ) : attempts.length > 0 ? (
                attempts.map((attempt) => (
                  <Table.Row key={attempt.id}>
                    <Table.Cell>
                      <span className={styles.postulanteNombre}>{attempt.postulante}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.evaluationName}>{attempt.evaluation}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {attempt.puntaje !== null && attempt.puntaje !== undefined ? (
                        <span className={styles.puntaje}>{attempt.puntaje.toFixed(1)}</span>
                      ) : (
                        <span className={styles.puntajeEmpty}>-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell align="center">
                      {getEstadoBadge(attempt.estado)}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.fecha}>{formatDate(attempt.startedAt)}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.fecha}>{formatDate(attempt.completedAt)}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleDelete(attempt)}
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
                <Table.Empty colSpan={7} icon={Award}>
                  {searchTerm || statusFilter
                    ? 'No se encontraron evaluaciones con ese criterio de búsqueda'
                    : 'No hay evaluaciones registradas'}
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
                if (total === 0) return 'Sin evaluaciones'
                return `${range[0]}-${range[1]} de ${total} evaluaciones`
              }}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              hideOnSinglePage={false}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedAttempt(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Evaluación"
        message={
          selectedAttempt
            ? `¿Estás seguro de que deseas eliminar el intento de evaluación de "${selectedAttempt.postulante}"? Esta acción no se puede deshacer.`
            : '¿Estás seguro de que deseas eliminar esta evaluación?'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
