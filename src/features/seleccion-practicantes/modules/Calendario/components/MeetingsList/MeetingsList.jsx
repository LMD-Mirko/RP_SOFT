import { Eye, Edit, Trash2, Calendar, Clock, User, Users, Link as LinkIcon } from 'lucide-react'
import { Table } from '@shared/components/UI/Table'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './MeetingsList.module.css'

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = (timeString) => {
  if (!timeString) return '-'
  // Si viene en formato HH:MM:SS, tomar solo HH:MM
  return timeString.substring(0, 5)
}

export function MeetingsList({ 
  meetings, 
  loading, 
  onView, 
  onEdit, 
  onDelete 
}) {
  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando reuniones...</p>
      </div>
    )
  }

  if (!meetings || meetings.length === 0) {
    return (
      <EmptyState
        iconPreset="calendar"
        colorPreset="blue"
        title="No hay reuniones programadas"
        description="Crea una nueva reunión usando el formulario"
      />
    )
  }

  return (
    <div className={styles.container}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Título</Table.HeaderCell>
            <Table.HeaderCell>Fecha</Table.HeaderCell>
            <Table.HeaderCell>Hora</Table.HeaderCell>
            <Table.HeaderCell>Duración</Table.HeaderCell>
            <Table.HeaderCell>Entrevistador</Table.HeaderCell>
            <Table.HeaderCell>Participantes</Table.HeaderCell>
            <Table.HeaderCell align="center">Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {meetings.map((meeting) => (
            <Table.Row key={meeting.id}>
              <Table.Cell>
                <div className={styles.titleCell}>
                  <Calendar size={16} className={styles.icon} />
                  <span className={styles.title}>{meeting.title}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className={styles.date}>{formatDate(meeting.date)}</span>
              </Table.Cell>
              <Table.Cell>
                <div className={styles.timeCell}>
                  <Clock size={14} className={styles.icon} />
                  <span>{formatTime(meeting.time)}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span>{meeting.duration} min</span>
              </Table.Cell>
              <Table.Cell>
                <div className={styles.interviewerCell}>
                  <User size={14} className={styles.icon} />
                  <span>{meeting.interviewer_name || '-'}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className={styles.participantsCell}>
                  <Users size={14} className={styles.icon} />
                  <span>{meeting.participants?.length || 0} participante(s)</span>
                </div>
              </Table.Cell>
              <Table.Cell align="center">
                <div className={styles.actions}>
                  <button
                    onClick={() => onView(meeting)}
                    className={styles.actionButtonView}
                    title="Ver Detalle"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(meeting)}
                    className={styles.actionButton}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(meeting)}
                    className={styles.actionButtonDelete}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

