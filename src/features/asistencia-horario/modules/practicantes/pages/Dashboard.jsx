import { useState, useEffect } from 'react'
import { Download, Mail, Plus, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react'
import { StatsCards } from '../components/StatsCards'
import { SearchAndFilters } from '../components/SearchAndFilters'
import { PracticanteCard } from '../components/PracticanteCard'
import { usePracticantes } from '../hooks'
import styles from './Dashboard.module.css'

// Función para transformar datos del backend al formato esperado por el frontend
const transformPracticante = (practicante) => {
  const nombreCompleto = `${practicante.nombre || ''} ${practicante.apellido || ''}`.trim()
  const iniciales = nombreCompleto
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return {
    id: practicante.id,
    nombre: nombreCompleto || practicante.correo?.split('@')[0] || 'Sin nombre',
    email: practicante.correo || practicante.email || '',
    equipo: practicante.equipo || 'Rpsoft • Team Alpha',
    servidor: practicante.servidor || 'rpsoft',
    estado: practicante.estado || 'activo',
    cohorte: practicante.cohorte || 'Cohorte 2024-A',
    score: practicante.score || 0,
    asistencia: practicante.asistencia || '0%',
    infracciones: practicante.infracciones || 0,
    avatar: iniciales || 'NA',
    color: practicante.color || '#3b82f6'
  }
}

// Modal para Agregar/Editar Practicante
function PractitionerModal({ isOpen, onClose, onSave, practitioner = null, isSaving = false }) {
  const [formData, setFormData] = useState(practitioner || {
    nombre: '',
    email: '',
    equipo: '',
    servidor: 'rpsoft',
    estado: 'activo',
    color: '#3b82f6'
  })

  const [errors, setErrors] = useState({})

  // Resetear formulario cuando se abre para edición
  useEffect(() => {
    if (practitioner) {
      setFormData(practitioner)
    } else {
      // Resetear para nuevo practicante
      setFormData({
        nombre: '',
        email: '',
        equipo: '',
        servidor: 'rpsoft',
        estado: 'activo',
        color: '#3b82f6'
      })
    }
  }, [practitioner])

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    setFormData(prev => ({ ...prev, nombre: value }))
    if (errors.nombre) {
      setErrors(prev => ({ ...prev, nombre: '' }))
    }
  }

  const handleTeamChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]/g, '')
    setFormData(prev => ({ ...prev, equipo: value }))
    if (errors.equipo) {
      setErrors(prev => ({ ...prev, equipo: '' }))
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, email: value }))
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  const handleServerChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, servidor: value }))
  }

  const handleStatusChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, estado: value }))
  }

  const handleColorChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, color: value }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.equipo.trim()) newErrors.equipo = 'El equipo es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const iniciales = formData.nombre
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      // Preparar datos para enviar al backend
      const data = {
        nombre: formData.nombre,
        email: formData.email,
        equipo: formData.equipo,
        servidor: formData.servidor,
        estado: formData.estado,
        color: formData.color,
        avatar: iniciales,
        score: practitioner?.score || Math.floor(Math.random() * 900),
        asistencia: practitioner?.asistencia || `${Math.floor(Math.random() * 30) + 70}%`,
        infracciones: practitioner?.infracciones || 0,
        cohorte: 'Cohorte 2024-A'
      }

      // Llamar a la función onSave que ahora manejará la API
      await onSave(data, practitioner?.id)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {practitioner ? 'Editar Practicante' : 'Agregar Nuevo Practicante'}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Nombre Completo <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="nombre"
                className={`${styles.formInput} ${errors.nombre ? styles.inputError : ''}`}
                placeholder="Juan Pérez García"
                value={formData.nombre}
                onChange={handleNameChange}
                disabled={isSaving}
              />
              {errors.nombre && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.nombre}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                placeholder="juan.perez@rpsoft.com"
                value={formData.email}
                onChange={handleEmailChange}
                disabled={isSaving}
              />
              {errors.email && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.email}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Equipo <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="equipo"
                className={`${styles.formInput} ${errors.equipo ? styles.inputError : ''}`}
                placeholder="Team Alpha"
                value={formData.equipo}
                onChange={handleTeamChange}
                disabled={isSaving}
              />
              {errors.equipo && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.equipo}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Servidor</label>
              <select
                name="servidor"
                className={styles.formInput}
                value={formData.servidor}
                onChange={handleServerChange}
                disabled={isSaving}
              >
                <option value="rpsoft">Rpsoft</option>
                <option value="innovacion">Innovacion</option>
                <option value="laboratorios">Laboratorios</option>
                <option value="minibootcamp">MiniBootcamp</option>
                <option value="recuperacion">Recuperacion</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Estado</label>
              <select
                name="estado"
                className={styles.formInput}
                value={formData.estado}
                onChange={handleStatusChange}
                disabled={isSaving}
              >
                <option value="activo">Activo</option>
                <option value="recuperacion">En Recuperación</option>
                <option value="riesgo">En Riesgo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Color del Avatar</label>
              <input
                type="color"
                name="color"
                className={styles.colorInput}
                value={formData.color}
                onChange={handleColorChange}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button 
              className={styles.cancelButton} 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button 
              className={styles.submitButton} 
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : practitioner ? 'Guardar Cambios' : 'Agregar Practicante'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedServer, setSelectedServer] = useState('todos')
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [selectedCohort, setSelectedCohort] = useState('todas')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingPractitioner, setEditingPractitioner] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const itemsPerPage = 6

  // Usar el hook actualizado
  const { 
    practicantes: practicantesData, 
    loading, 
    pagination,
    loadPracticantes,
    createPracticante,
    updatePracticante,
    deletePracticante
  } = usePracticantes()

  // Transformar datos del backend
  const transformedPracticantes = practicantesData.map(transformPracticante)

  // Filtrar practicantes (puedes mover esto al backend)
  const filteredPracticantes = transformedPracticantes.filter(practicante => {
    const matchesSearch = searchTerm === '' || 
      practicante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practicante.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesServer = selectedServer === 'todos' ||
      practicante.servidor === selectedServer

    const matchesStatus = selectedStatus === 'todos' ||
      practicante.estado === selectedStatus

    return matchesSearch && matchesServer && matchesStatus
  })

  // Paginación
  const totalPages = Math.ceil(filteredPracticantes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPracticantes = filteredPracticantes.slice(startIndex, endIndex)

  // Manejar guardar (crear o actualizar)
  const handleSavePractitioner = async (data, id = null) => {
    setIsSaving(true);
    try {
      if (id) {
        // Actualizar practicante existente
        await updatePracticante(id, data);
      } else {
        // Crear nuevo practicante
        await createPracticante(data);
      }
      
      // Recargar los practicantes para mostrar los cambios
      await loadPracticantes(currentPage, {
        estado: selectedStatus !== 'todos' ? selectedStatus : undefined,
        nombre: searchTerm || undefined,
      });
      
    } catch (error) {
      console.error('Error al guardar practicante:', error);
      alert('Error al guardar el practicante. Por favor, intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPractitioner = (practitioner) => {
    // Extraer solo el nombre del equipo (sin el servidor)
    const equipoNombre = practitioner.equipo.split(' • ')[1] || practitioner.equipo;
    
    setEditingPractitioner({
      ...practitioner,
      equipo: equipoNombre
    });
    setShowModal(true);
  };

  const handleAddPractitioner = () => {
    setEditingPractitioner(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPractitioner(null);
  };

  // Manejar cambios en filtros
  useEffect(() => {
    const params = {};
    if (selectedStatus !== 'todos') params.estado = selectedStatus;
    if (searchTerm) params.nombre = searchTerm;
    
    loadPracticantes(currentPage, params);
  }, [currentPage, selectedStatus, searchTerm]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Directorio de Practicantes</h1>
          <p>Gestiona y monitorea a todos los practicantes del programa</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.exportButton}>
            <Download size={16} />
            Exportar
          </button>
          <button className={styles.emailButton}>
            <Mail size={16} />
            Email Masivo
          </button>
          <button className={styles.addButton} onClick={handleAddPractitioner}>
            <Plus size={16} />
            Agregar Practicante
          </button>
        </div>
      </div>

      <StatsCards practicantes={transformedPracticantes} />

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedServer={selectedServer}
        onServerChange={setSelectedServer}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCohort={selectedCohort}
        onCohortChange={setSelectedCohort}
      />

      <div className={styles.practicantesGrid}>
        {loading ? (
          <div className={styles.loadingMessage}>Cargando practicantes...</div>
        ) : currentPracticantes.length > 0 ? (
          currentPracticantes.map(practicante => (
            <PracticanteCard 
              key={practicante.id} 
              practicante={practicante}
              onEdit={handleEditPractitioner}
              onDelete={() => {
                if (window.confirm('¿Está seguro de eliminar este practicante?')) {
                  deletePracticante(practicante.id);
                }
              }}
              isEditable={true}
            />
          ))
        ) : (
          <div className={styles.emptyMessage}>
            {searchTerm ? 'No se encontraron practicantes con esos criterios' : 'No hay practicantes registrados'}
          </div>
        )}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </button>
        <span className={styles.paginationInfo}>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <PractitionerModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSavePractitioner}
        practitioner={editingPractitioner}
        isSaving={isSaving}
      />
    </div>
  )
}