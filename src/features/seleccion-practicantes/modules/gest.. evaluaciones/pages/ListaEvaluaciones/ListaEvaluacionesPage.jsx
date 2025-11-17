import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Award, Trash2, FileText, Settings } from 'lucide-react'
import { Pagination } from 'antd'
import { Table } from '@shared/components/UI/Table'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { useEvaluaciones } from '../../hooks/useEvaluaciones'
import { useToast } from '@shared/components/Toast'
import { Skeleton } from '../../../../shared/components/Skeleton'
import styles from './ListaEvaluacionesPage.module.css'

const mapEvaluacionFromAPI = (apiData) => {
  return {
    id: apiData.id,
    title: apiData.title || 'N/A',
    description: apiData.description || '',
    jobPosting: apiData.job_posting?.title || apiData.job_posting_id || 'N/A',
    jobPostingId: apiData.job_posting_id,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    _apiData: apiData,
  }
}

export function ListaEvaluacionesPage() {
  const navigate = useNavigate()
  const {
    evaluaciones: apiEvaluaciones,
    loading,
    pagination,
    loadEvaluaciones,
    deleteEvaluacion,
  } = useEvaluaciones()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null)
  const toast = useToast()

  useEffect(() => {
    loadEvaluaciones()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filtrar y paginar en el frontend
  const filteredEvaluaciones = useMemo(() => {
    let filtered = apiEvaluaciones.map(mapEvaluacionFromAPI)

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (evaluacion) =>
          evaluacion.title.toLowerCase().includes(search) ||
          evaluacion.description.toLowerCase().includes(search) ||
          evaluacion.jobPosting.toString().toLowerCase().includes(search)
      )
    }

    return filtered
  }, [apiEvaluaciones, searchTerm])

  // Paginación en el frontend
  const paginatedEvaluaciones = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredEvaluaciones.slice(start, end)
  }, [filteredEvaluaciones, currentPage, pageSize])

  const handleDelete = (evaluacion) => {
    setSelectedEvaluacion(evaluacion)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedEvaluacion) {
      await deleteEvaluacion(selectedEvaluacion.id)
      setIsDeleteModalOpen(false)
      setSelectedEvaluacion(null)
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

  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    if (size && size !== pageSize) {
      setPageSize(size)
      setCurrentPage(1) // Resetear a la primera página cuando cambia el tamaño
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Evaluaciones Técnicas</h1>
          <p className={styles.subtitle}>Gestiona las evaluaciones técnicas del sistema</p>
        </div>
      </div>

      <div className={styles.searchAndFilters}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por título, descripción o convocatoria..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Resetear a la primera página al buscar
            }}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableSection}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Título</Table.HeaderCell>
                <Table.HeaderCell>Descripción</Table.HeaderCell>
                <Table.HeaderCell>Convocatoria</Table.HeaderCell>
                <Table.HeaderCell align="center">Fecha Creación</Table.HeaderCell>
                <Table.HeaderCell align="center" width="200px">
                  Acciones
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Table.Row key={i}>
                      <Table.Cell>
                        <Skeleton variant="text" width="70%" height={16} />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton variant="text" width="60%" height={16} />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton variant="text" width="50%" height={16} />
                      </Table.Cell>
                      <Table.Cell align="center">
                        <Skeleton variant="text" width="60%" height={16} />
                      </Table.Cell>
                      <Table.Cell align="center">
                        <Skeleton variant="rectangular" width={100} height={32} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </>
              ) : paginatedEvaluaciones.length > 0 ? (
                paginatedEvaluaciones.map((evaluacion) => (
                  <Table.Row key={evaluacion.id}>
                    <Table.Cell>
                      <span className={styles.evaluationTitle}>{evaluacion.title}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.evaluationDescription}>
                        {evaluacion.description || '-'}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.jobPosting}>{evaluacion.jobPosting}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <span className={styles.fecha}>{formatDate(evaluacion.createdAt)}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        <button
                          onClick={() => navigate(`${evaluacion.id}/preguntas`)}
                          className={styles.actionButton}
                          title="Gestionar Preguntas"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`${evaluacion.id}/configuracion`)}
                          className={styles.actionButton}
                          title="Configuración"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(evaluacion)}
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
                <Table.Empty colSpan={5} icon={Award}>
                  {searchTerm
                    ? 'No se encontraron evaluaciones con ese criterio de búsqueda'
                    : 'No hay evaluaciones registradas'}
                </Table.Empty>
              )}
            </Table.Body>
          </Table>
        </div>

        {!loading && filteredEvaluaciones.length > 0 && (
          <div className={styles.pagination}>
            <Pagination
              current={currentPage}
              total={filteredEvaluaciones.length}
              pageSize={pageSize}
              pageSizeOptions={['10', '20', '30', '50', '100']}
              showSizeChanger={true}
              showQuickJumper={filteredEvaluaciones.length > 50}
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
          setSelectedEvaluacion(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Evaluación"
        message={
          selectedEvaluacion
            ? `¿Estás seguro de que deseas eliminar la evaluación "${selectedEvaluacion.title}"? Esta acción no se puede deshacer.`
            : '¿Estás seguro de que deseas eliminar esta evaluación?'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

