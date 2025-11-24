import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Users, Target, Trophy, Loader2 } from 'lucide-react'
import ExcelJS from 'exceljs'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EmptyState } from '@shared/components/EmptyState'
import { useToast } from '@shared/components/Toast'
import { getExamAssignments, getExamView } from '../services'
import styles from './ExamParticipantsPage.module.css'

const STATUS_LABELS = {
  assigned: 'Asignado',
  started: 'En progreso',
  completed: 'Completado',
  expired: 'Expirado',
}

export function ExamParticipantsPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exam, setExam] = useState(null)
  const [participants, setParticipants] = useState([])
  const isLoadingRef = useRef(false)

  const loadData = useCallback(async () => {
    if (!examId || isLoadingRef.current) return
    try {
      isLoadingRef.current = true
      setLoading(true)
      const [examData, assignmentsData] = await Promise.all([
        getExamView(examId),
        getExamAssignments(examId),
      ])
      setExam(examData)
      setParticipants(assignmentsData.members || assignmentsData.results || [])
    } catch (error) {
      console.error('Error al cargar participantes:', error)
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'No se pudo cargar la lista de participantes'
      toast.error(message)
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId])

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId])

  const stats = useMemo(() => {
    const total = participants.length
    const completed = participants.filter((member) => member.status === 'completed').length
    const started = participants.filter((member) => member.status === 'started').length
    const assigned = participants.filter((member) => member.status === 'assigned').length

    const averages = participants
      .map((m) => (typeof m.average_score === 'number' ? m.average_score : null))
      .filter((value) => value !== null)

    const bestScore = averages.length ? Math.max(...averages) : null

    return {
      total,
      completed,
      started,
      assigned,
      bestScore,
    }
  }, [participants])

  const handleExport = async () => {
    if (!participants.length) {
      toast.info('No hay participantes para exportar')
      return
    }

    try {
      setExporting(true)
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Participantes')

      worksheet.columns = [
        { header: '#', key: 'index', width: 6 },
        { header: 'Nombre', key: 'name', width: 32 },
        { header: 'Correo', key: 'email', width: 32 },
        { header: 'Estado', key: 'status', width: 16 },
        { header: 'Intentos', key: 'attempts', width: 12 },
        { header: 'Promedio (0-20)', key: 'average', width: 18 },
        { header: 'Asignado el', key: 'assignedAt', width: 22 },
      ]

      participants.forEach((member, index) => {
        worksheet.addRow({
          index: index + 1,
          name: member.full_name || '—',
          email: member.email || '—',
          status: STATUS_LABELS[member.status] || member.status || '—',
          attempts: member.attempts_count ?? 0,
          average:
            member.average_score !== null && member.average_score !== undefined
              ? member.average_score.toFixed(2)
              : '—',
          assignedAt: member.assigned_at
            ? new Date(member.assigned_at).toLocaleString()
            : '—',
        })
      })

      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true, color: { argb: 'FF0F172A' } }
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' },
      }

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          }
        })
        if (rowNumber > 1 && rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' },
          }
        }
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const fileName = `${(exam?.title || 'examen').replace(/\s+/g, '_')}-participantes.xlsx`
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Archivo exportado correctamente')
    } catch (error) {
      console.error('Error al exportar participantes:', error)
      toast.error('No se pudo generar el Excel')
    } finally {
      setExporting(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <Skeleton variant="rectangular" width="100%" height={320} />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </div>
      )
    }

    if (!participants.length) {
      return (
        <EmptyState
          iconPreset="users"
          colorPreset="dark"
          iconColor="#0f172a"
          title="Sin participantes asignados"
          description="Cuando se asignen usuarios aparecerán en esta tabla."
          className={styles.emptyState}
        >
          <button
            type="button"
            className={styles.emptyActionButton}
            onClick={() => navigate('/seleccion-practicantes/examenes')}
          >
            Volver al listado
          </button>
        </EmptyState>
      )
    }

    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Participante</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Intentos</th>
              <th>Promedio</th>
              <th>Asignado el</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((member, index) => (
              <tr key={member.assignment_id || member.user_id || index}>
                <td>{index + 1}</td>
                <td>
                  <div className={styles.participant}>
                    <div className={styles.avatar}>{member.full_name?.charAt(0) || 'U'}</div>
                    <div>
                      <p className={styles.participantName}>{member.full_name || 'Sin nombre'}</p>
                      <span className={styles.participantId}>{member.user_id}</span>
                    </div>
                  </div>
                </td>
                <td>{member.email || '—'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[`status-${member.status}`] || ''}`}>
                    {STATUS_LABELS[member.status] || member.status || '—'}
                  </span>
                </td>
                <td>{member.attempts_count ?? 0}</td>
                <td>{member.average_score !== null && member.average_score !== undefined ? `${member.average_score.toFixed(2)} / 20` : '—'}</td>
                <td>{member.assigned_at ? new Date(member.assigned_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft size={18} />
            Volver
          </button>
          <div>
            <h1>Participantes del examen</h1>
            <p>{exam?.title || 'Cargando examen...'}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleExport}
            className={styles.excelButton}
            disabled={exporting}
          >
            {exporting ? <Loader2 size={18} /> : <Download size={18} />}
            {exporting ? 'Exportando...' : 'Descargar Excel'}
          </button>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Users size={20} />
          </div>
          <div>
            <p>Total asignados</p>
            <strong>{stats.total}</strong>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Trophy size={20} />
          </div>
          <div>
            <p>Completados</p>
            <strong>{stats.completed}</strong>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Target size={20} />
          </div>
          <div>
            <p>En progreso</p>
            <strong>{stats.started}</strong>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Target size={20} />
          </div>
          <div>
            <p>Sin iniciar</p>
            <strong>{stats.assigned}</strong>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Trophy size={20} />
          </div>
          <div>
            <p>Mejor promedio</p>
            <strong>{stats.bestScore !== null ? `${stats.bestScore.toFixed(2)} / 20` : '—'}</strong>
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  )
}

