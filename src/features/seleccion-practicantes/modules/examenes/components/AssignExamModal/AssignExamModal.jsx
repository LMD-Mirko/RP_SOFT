import { useState, useEffect, useMemo } from 'react'
import { User, Check, Loader2, Search } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { getAvailableUsers, assignExam, getExamAssignments } from '../../services'
import { useToast } from '@shared/components/Toast'
import styles from './AssignExamModal.module.css'
import clsx from 'clsx'

export function AssignExamModal({ isOpen, onClose, examId, onSuccess }) {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    if (isOpen && examId) {
      loadData()
    } else {
      // Limpiar selección cuando se cierra el modal
      setSelected([])
      setSearchTerm('')
    }
  }, [isOpen, examId])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Cargar usuarios disponibles y asignaciones actuales en paralelo
      const [usersResponse, assignmentsResponse] = await Promise.all([
        getAvailableUsers().catch(err => {
          console.error('Error al cargar usuarios:', err)
          toast.error('Error al cargar usuarios disponibles')
          return { users: [] }
        }),
        getExamAssignments(examId).catch(err => {
          console.error('Error al cargar asignaciones actuales:', err)
          // No mostrar error al usuario, solo no preseleccionar
          return { members: [] }
        })
      ])

      const usersList = usersResponse.users || []
      setUsers(usersList)

      // Obtener miembros ya asignados
      const members = assignmentsResponse.members || assignmentsResponse.assignments || assignmentsResponse.results || []
      
      // Crear un mapa de user_id a uuid para mapear correctamente
      const userIdToUuidMap = new Map()
      usersList.forEach(user => {
        if (user.uuid) {
          userIdToUuidMap.set(user.id, user.uuid)
          userIdToUuidMap.set(user.uuid, user.uuid) // También mapear uuid a uuid
        }
      })
      
      // Extraer los user_ids de los miembros ya asignados y convertirlos a uuids
      const assignedUserIds = members
        .map(member => {
          const userId = member.user_id || member.user?.uuid || member.user?.id
          // Si es un uuid, usarlo directamente; si es un id numérico, buscar el uuid correspondiente
          return userIdToUuidMap.get(userId) || userId
        })
        .filter(Boolean) // Filtrar valores nulos/undefined
        .filter(uuid => usersList.some(user => user.uuid === uuid)) // Solo incluir uuids que existen en la lista de usuarios disponibles
      
      // Preseleccionar los usuarios ya asignados
      if (assignedUserIds.length > 0) {
        setSelected(assignedUserIds)
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users

    const searchLower = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.paternal_lastname && user.paternal_lastname.toLowerCase().includes(searchLower))
    )
  }, [users, searchTerm])

  const handleToggle = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selected.length === filteredUsers.length) {
      setSelected([])
    } else {
      setSelected(filteredUsers.map((u) => u.uuid))
    }
  }

  const handleAssign = async () => {
    if (selected.length === 0) {
      toast.error('Selecciona al menos un usuario')
      return
    }

    try {
      setIsAssigning(true)
      await assignExam(examId, { user_ids: selected })
      toast.success(`Examen asignado a ${selected.length} usuario(s)`)
      setSelected([])
      setSearchTerm('')
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error al asignar examen:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al asignar el examen'
      toast.error(errorMessage)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleClose = () => {
    setSelected([])
    setSearchTerm('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Asignar Examen a Usuarios"
      size="lg"
      closeOnOverlayClick={!isAssigning}
    >
      <div className={styles.content}>
        <Input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading || isAssigning}
          icon={Search}
          iconPosition="left"
        />

        <div className={styles.selectAll}>
          <button
            type="button"
            onClick={handleSelectAll}
            className={styles.selectAllButton}
            disabled={loading || isAssigning || filteredUsers.length === 0}
          >
            {selected.length === filteredUsers.length && filteredUsers.length > 0
              ? 'Deseleccionar todos'
              : 'Seleccionar todos'}
          </button>
          <span className={styles.selectedCount}>
            {selected.length} seleccionado{selected.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className={styles.usersList}>
          {loading ? (
            <div className={styles.loadingState}>
              <Loader2 size={32} className={styles.spinner} />
              <p>Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isSelected = selected.includes(user.uuid)
              const fullName = `${user.name || ''} ${user.paternal_lastname || ''} ${user.maternal_lastname || ''}`.trim() || 'Sin nombre'
              
              return (
                <div
                  key={user.uuid}
                  className={clsx(
                    styles.userItem,
                    isSelected && styles.selected
                  )}
                  onClick={() => !isAssigning && handleToggle(user.uuid)}
                >
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      <User size={20} />
                    </div>
                    <div>
                      <p className={styles.userName}>
                        {fullName}
                        {user.type && (
                          <span className={styles.typeBadge}>
                            {user.type === 'admin' ? 'Admin' : 'Postulante'}
                          </span>
                        )}
                      </p>
                      <p className={styles.userEmail}>{user.email}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className={styles.checkIcon}>
                      <Check size={18} />
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className={styles.emptyState}>
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="secondary" onClick={handleClose} disabled={isAssigning}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleAssign}
          loading={isAssigning}
          disabled={isAssigning || selected.length === 0}
        >
          Asignar a {selected.length} usuario{selected.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </Modal>
  )
}

