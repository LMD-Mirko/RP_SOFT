import { useState } from 'react'
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { Table } from '@shared/components/UI/Table'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { PostulanteModal } from '../components/PostulanteModal'
import { PostulanteDetailModal } from '../components/PostulanteDetailModal'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { useToast } from '@shared/components/Toast'
import styles from './PostulantesPage.module.css'

// Datos mock para demostración
const mockPostulantes = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    correo: 'juan.perez@senati.pe',
    dni: '12345678',
    telefono: '+51 987 654 321',
    direccion: 'Av. Principal 123, Lima',
    fechaNacimiento: '1995-05-15',
    etapa: 'Prueba Técnica',
    estado: 'En Progreso',
    fecha: '2025-01-15',
  },
  {
    id: 2,
    nombre: 'María García',
    correo: 'maria.garcia@senati.pe',
    dni: '87654321',
    telefono: '+51 987 654 322',
    direccion: 'Jr. Los Olivos 456, Lima',
    fechaNacimiento: '1998-08-20',
    etapa: 'Formulario',
    estado: 'Completado',
    fecha: '2025-01-15',
  },
  {
    id: 3,
    nombre: 'Carlos López',
    correo: 'carlos.lopez@senati.pe',
    dni: '11223344',
    telefono: '+51 987 654 323',
    direccion: 'Calle Las Flores 789, Arequipa',
    fechaNacimiento: '1997-03-10',
    etapa: 'Entrevista',
    estado: 'Pendiente',
    fecha: '2025-01-15',
  },
  {
    id: 4,
    nombre: 'Ana Ramírez',
    correo: 'ana.ramirez@senati.pe',
    dni: '55667788',
    telefono: '+51 987 654 324',
    direccion: 'Av. Libertad 321, Trujillo',
    fechaNacimiento: '1996-11-25',
    etapa: 'Prueba Técnica',
    estado: 'En Progreso',
    fecha: '2025-01-14',
  },
  {
    id: 5,
    nombre: 'Pedro Sánchez',
    correo: 'pedro.sanchez@senati.pe',
    dni: '99887766',
    telefono: '+51 987 654 325',
    direccion: 'Mz. B Lote 15, Villa El Salvador',
    fechaNacimiento: '1999-02-14',
    etapa: 'Formulario',
    estado: 'Completado',
    fecha: '2025-01-13',
  },
]

export function PostulantesPage() {
  const [postulantes, setPostulantes] = useState(mockPostulantes)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedPostulante, setSelectedPostulante] = useState(null)
  const [postulanteToView, setPostulanteToView] = useState(null)
  const [postulanteToDelete, setPostulanteToDelete] = useState(null)
  const toast = useToast()

  const filteredPostulantes = postulantes.filter(
    (postulante) =>
      postulante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postulante.correo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSave = (formData) => {
    if (formData.id) {
      // Editar postulante existente
      setPostulantes((prev) =>
        prev.map((p) =>
          p.id === formData.id
            ? {
                ...p,
                nombre: formData.nombre,
                correo: formData.correo,
                dni: formData.dni || p.dni || '',
                telefono: formData.telefono || p.telefono || '',
                direccion: formData.direccion || p.direccion || '',
                fechaNacimiento: formData.fechaNacimiento || p.fechaNacimiento || '',
                etapa: formData.etapa,
                estado: formData.estado,
                fecha: formData.fecha,
              }
            : p
        )
      )
      toast.success('Postulante actualizado correctamente')
    } else {
      // Crear nuevo postulante
      const newPostulante = {
        id: Date.now(),
        nombre: formData.nombre,
        correo: formData.correo,
        dni: formData.dni || '',
        telefono: formData.telefono || '',
        direccion: formData.direccion || '',
        fechaNacimiento: formData.fechaNacimiento || '',
        etapa: formData.etapa,
        estado: formData.estado,
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
      }
      setPostulantes((prev) => [newPostulante, ...prev])
      toast.success('Postulante creado correctamente')
    }
    setSelectedPostulante(null)
  }

  const handleEdit = (postulante) => {
    setSelectedPostulante(postulante)
    setIsModalOpen(true)
  }

  const handleDelete = (postulante) => {
    setPostulanteToDelete(postulante)
    setIsConfirmModalOpen(true)
  }

  const confirmDelete = () => {
    if (postulanteToDelete) {
      setPostulantes((prev) => prev.filter((p) => p.id !== postulanteToDelete.id))
      toast.success('Postulante eliminado correctamente')
      setPostulanteToDelete(null)
    }
    setIsConfirmModalOpen(false)
  }

  const handleViewDetail = (postulante) => {
    setPostulanteToView(postulante)
    setIsDetailModalOpen(true)
  }

  const getEtapaBadge = (etapa) => {
    return <span className={styles.badgeEtapa}>{etapa}</span>
  }

  const getEstadoBadge = (estado) => {
    if (estado === 'Completado') {
      return <span className={styles.badgeEstadoCompleted}>{estado}</span>
    }
    if (estado === 'En Progreso') {
      return <span className={styles.badgeEstadoProgress}>{estado}</span>
    }
    return <span className={styles.badgeEstadoPending}>{estado}</span>
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
        <Button
          onClick={() => {
            setSelectedPostulante(null)
            setIsModalOpen(true)
          }}
          variant="primary"
          icon={Plus}
        >
          Nuevo Postulante
        </Button>
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

      {/* Table */}
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
            {filteredPostulantes.length > 0 ? (
              filteredPostulantes.map((postulante) => (
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
                    {getEstadoBadge(postulante.estado)}
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
                      <button
                        onClick={() => handleEdit(postulante)}
                        className={styles.actionButton}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(postulante)}
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
                {searchTerm
                  ? 'No se encontraron postulantes con ese criterio de búsqueda'
                  : 'No hay postulantes registrados'}
              </Table.Empty>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Modal de Crear/Editar */}
      <PostulanteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPostulante(null)
        }}
        onSave={handleSave}
        postulante={selectedPostulante}
      />

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
          setPostulanteToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Eliminar Postulante"
        message={
          postulanteToDelete
            ? `¿Seguro que deseas eliminar a ${postulanteToDelete.nombre}?`
            : '¿Seguro que deseas eliminar este postulante?'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

