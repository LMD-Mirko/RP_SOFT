import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Table } from '@shared/components/UI/Table'
import { Pagination } from 'antd'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { useMisEvaluaciones } from '../../hooks'
import styles from './MisEvaluacionesPage.module.css'

/**
 * Página para listar los intentos de evaluación del postulante
 */
export function MisEvaluacionesPage() {
  const navigate = useNavigate()
  const { loading, intentos, pagination, cargarIntentos } = useMisEvaluaciones()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = {
      page: currentPage,
      page_size: pageSize,
    }
    if (statusFilter) {
      params.status = statusFilter
    }
    cargarIntentos(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, statusFilter])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded':
        return <CheckCircle2 size={16} className={styles.iconGraded} />
      case 'submitted':
        return <Clock size={16} className={styles.iconSubmitted} />
      case 'in_progress':
        return <Clock size={16} className={styles.iconInProgress} />
      case 'expired':
        return <AlertCircle size={16} className={styles.iconExpired} />
      default:
        return <Clock size={16} />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'graded':
        return 'Calificado'
      case 'submitted':
        return 'Enviado'
      case 'in_progress':
        return 'En Progreso'
      case 'expired':
        return 'Expirado'
      default:
        return status || '-'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleViewResults = (evaluationId, attemptId) => {
    navigate(`/seleccion-practicantes/evaluaciones/${evaluationId}/resultados`)
  }

  const handleContinue = (evaluationId) => {
    navigate(`/seleccion-practicantes/evaluaciones/${evaluationId}/completar`)
  }

  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    if (size && size !== pageSize) {
      setPageSize(size)
      setCurrentPage(1)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Evaluaciones</h1>
          <p className={styles.subtitle}>
            Gestiona y revisa tus evaluaciones completadas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          className={styles.filterSelect}
        >
          <option value="">Todos los estados</option>
          <option value="in_progress">En Progreso</option>
          <option value="submitted">Enviado</option>
          <option value="graded">Calificado</option>
          <option value="expired">Expirado</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Evaluación</Table.HeaderCell>
              <Table.HeaderCell align="center">Estado</Table.HeaderCell>
              <Table.HeaderCell align="center">Puntaje</Table.HeaderCell>
              <Table.HeaderCell align="center">Fecha Inicio</Table.HeaderCell>
              <Table.HeaderCell align="center">Fecha Finalización</Table.HeaderCell>
              <Table.HeaderCell align="center" width="150px">
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
                    <Table.Cell align="center">
                      <Skeleton variant="text" width="60%" height={16} />
                    </Table.Cell>
                    <Table.Cell align="center">
                      <Skeleton variant="text" width="50%" height={16} />
                    </Table.Cell>
                    <Table.Cell align="center">
                      <Skeleton variant="text" width="60%" height={16} />
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
            ) : intentos.length > 0 ? (
              intentos.map((intento) => {
                const evaluation = intento.evaluation || {}
                const canViewResults = intento.status === 'graded'
                const canContinue = intento.status === 'in_progress'

                return (
                  <Table.Row key={intento.id}>
                    <Table.Cell>
                      <div className={styles.evaluationInfo}>
                        <span className={styles.evaluationTitle}>
                          {evaluation.title || 'Evaluación'}
                        </span>
                        {evaluation.description && (
                          <span className={styles.evaluationDescription}>
                            {evaluation.description}
                          </span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.statusBadge}>
                        {getStatusIcon(intento.status)}
                        <span>{getStatusLabel(intento.status)}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {intento.score !== null && intento.score !== undefined ? (
                        <div className={styles.scoreInfo}>
                          <span className={styles.scoreValue}>
                            {intento.score.toFixed(1)}
                          </span>
                          {intento.total_points && (
                            <span className={styles.scoreTotal}>
                              / {intento.total_points.toFixed(1)}
                            </span>
                          )}
                          {intento.percentage !== null &&
                            intento.percentage !== undefined && (
                              <span className={styles.scorePercentage}>
                                ({intento.percentage.toFixed(1)}%)
                              </span>
                            )}
                        </div>
                      ) : (
                        <span className={styles.noScore}>-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell align="center">
                      <span className={styles.date}>
                        {formatDate(intento.started_at)}
                      </span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <span className={styles.date}>
                        {formatDate(
                          intento.graded_at ||
                            intento.submitted_at ||
                            intento.completed_at
                        )}
                      </span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <div className={styles.actions}>
                        {canViewResults && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleViewResults(evaluation.id || intento.evaluation_id, intento.id)
                            }
                            className={styles.actionButton}
                          >
                            <Eye size={14} />
                            Ver Resultados
                          </Button>
                        )}
                        {canContinue && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              handleContinue(evaluation.id || intento.evaluation_id)
                            }
                            className={styles.actionButton}
                          >
                            Continuar
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            ) : (
              <Table.Empty
                colSpan={6}
                icon={Award}
                colorPreset="dark"
                title={statusFilter ? 'Sin evaluaciones con este estado' : 'Aún no tienes evaluaciones'}
                description={
                  statusFilter
                    ? 'Prueba cambiando el filtro para ver otros intentos.'
                    : 'Tus evaluaciones finalizadas aparecerán aquí.'
                }
              />
            )}
          </Table.Body>
        </Table>

        {!loading && intentos.length > 0 && (
          <div className={styles.pagination}>
            <Pagination
              current={currentPage}
              total={pagination.total}
              pageSize={pageSize}
              pageSizeOptions={['10', '20', '30', '50']}
              showSizeChanger={true}
              showTotal={(total, range) => {
                if (total === 0) return 'Sin evaluaciones'
                return `${range[0]}-${range[1]} de ${total} evaluaciones`
              }}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

