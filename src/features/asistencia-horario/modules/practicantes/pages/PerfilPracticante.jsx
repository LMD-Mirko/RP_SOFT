import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare, Github, Linkedin, Award, Clock, TrendingUp, AlertTriangle, Edit, Trash2, MoreVertical } from 'lucide-react'
import styles from './PerfilPracticante.module.css'

// Datos de ejemplo - en producción vendrían de una API
const practicantesData = {
  1: {
    id: 1,
    nombre: 'Anderson Aponte Pantoja',
    email: 'Apontechizito@gmail.com',
    discord: 'Darkai#1234',
    avatar: 'AA',
    color: '#3b82f6',
    estado: 'Activo',
    rol: 'Product Owner',
    destacado: true,
    descripcion: 'Desarrollador Full Stack apasionado por crear soluciones innovadoras.',
    github: 'github.com/PieroSalced',
    linkedin: 'linkedin.com/in/juanperez',
    especializacion: 'Frontend',
    servidor: 'Rpsoft',
    equipoActual: 'Asistencia Horario',
    scrum: 'Antony Salcedo ',
    scoreActual: 800,
    horasSemanales: '12/30',
    asistencia: '30%',
    infracciones: 0,
    habilidades: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Git']
  }
}

// Modal para confirmación de eliminación
function DeleteConfirmModal({ isOpen, practicante, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={styles.deleteIcon}>
              <Trash2 size={24} />
            </div>
            <h2 className={styles.modalTitle}>Eliminar Practicante</h2>
          </div>
        </div>

        <div className={styles.modalContent}>
          <p>
            ¿Estás seguro de que deseas eliminar a <strong>{practicante?.nombre}</strong>? 
            Esta acción no se puede deshacer y se perderán todos los datos del practicante.
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.deleteButton} onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// Modal para editar practicante
function EditPractitionerModal({ isOpen, practicante, onClose, onSave }) {
  const [formData, setFormData] = useState(practicante || {
    nombre: '',
    email: '',
    discord: '',
    descripcion: '',
    github: '',
    linkedin: '',
    especializacion: '',
    equipoActual: '',
    scrum: '',
    habilidades: []
  })

  const [newSkill, setNewSkill] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.habilidades.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        habilidades: [...formData.habilidades, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      habilidades: formData.habilidades.filter(skill => skill !== skillToRemove)
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Editar Practicante</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <MoreVertical size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombre Completo</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                className={styles.formInput}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Discord</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.discord}
                onChange={(e) => setFormData({...formData, discord: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>GitHub</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.github}
                onChange={(e) => setFormData({...formData, github: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>LinkedIn</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Especialización</label>
              <select
                className={styles.formInput}
                value={formData.especializacion}
                onChange={(e) => setFormData({...formData, especializacion: e.target.value})}
              >
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="DevOps">DevOps</option>
                <option value="QA">QA</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Equipo Actual</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.equipoActual}
                onChange={(e) => setFormData({...formData, equipoActual: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Scrum Master</label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.scrum}
                onChange={(e) => setFormData({...formData, scrum: e.target.value})}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Descripción</label>
            <textarea
              className={styles.formTextarea}
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Habilidades</label>
            <div className={styles.skillsInputContainer}>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Agregar habilidad..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className={styles.addSkillButton}
                onClick={addSkill}
              >
                Agregar
              </button>
            </div>
            <div className={styles.skillsPreview}>
              {formData.habilidades.map((skill, index) => (
                <span key={index} className={styles.skillPreviewBadge}>
                  {skill}
                  <button
                    type="button"
                    className={styles.removeSkillButton}
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function PerfilPracticante() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [practicante, setPracticante] = useState(practicantesData[id] || practicantesData[1])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleDelete = () => {
    // En producción, aquí harías una llamada a la API
    console.log('Eliminando practicante:', practicante.id)
    // Redirigir al dashboard después de eliminar
    navigate('/dashboard')
  }

  const handleSave = (updatedData) => {
    setPracticante(updatedData)
    setShowEditModal(false)
    // En producción, aquí harías una llamada a la API para actualizar
    console.log('Guardando cambios:', updatedData)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerContent}>
          <h1>Perfil de Practicante</h1>
          <p>Información completa y métricas de desempeño</p>
        </div>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div
              className={styles.avatar}
              style={{ backgroundColor: practicante.color }}
            >
              {practicante.avatar}
            </div>
            <div className={styles.profileDetails}>
              <h2>{practicante.nombre}</h2>
              <p className={styles.email}>{practicante.email}</p>
              <p className={styles.discord}>{practicante.discord}</p>
              <div className={styles.badges}>
                <span className={styles.badgeActive}>{practicante.estado}</span>
                <span className={styles.badgeRole}>{practicante.rol}</span>
                {practicante.destacado && (
                  <span className={styles.badgeDestacado}>Destacado</span>
                )}
              </div>
              <p className={styles.description}>{practicante.descripcion}</p>
              <div className={styles.socialLinks}>
                <a href={`https://${practicante.github}`} className={styles.socialLink}>
                  <Github size={16} />
                  GitHub
                </a>
                <a href={`https://${practicante.linkedin}`} className={styles.socialLink}>
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.actionButton}>
              <Mail size={16} />
              Email
            </button>
            <button className={styles.actionButton}>
              <MessageSquare size={16} />
              Discord
            </button>
            <button 
              className={styles.editButton}
              onClick={() => setShowEditModal(true)}
            >
              <Edit size={16} />
              Editar
            </button>
            <button 
              className={styles.deleteButton}
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        </div>

        <div className={styles.profileGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Especialización</span>
            <span className={styles.infoValue}>{practicante.especializacion}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Servidor</span>
            <span className={styles.infoValue}>{practicante.servidor}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Equipo Actual</span>
            <span className={styles.infoValue}>{practicante.equipoActual}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Scrum Master</span>
            <span className={styles.infoValue}>{practicante.scrum}</span>
          </div>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard} style={{ backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
          <div className={styles.metricContent}>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Score Actual</span>
              <div className={styles.metricValue}>{practicante.scoreActual}</div>
              <div className={styles.metricSubtext}>Elite</div>
            </div>
            <div className={styles.metricIcon} style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              <Award size={24} />
            </div>
          </div>
        </div>

        <div className={styles.metricCard} style={{ backgroundColor: '#eff6ff', borderColor: '#dbeafe' }}>
          <div className={styles.metricContent}>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Horas Semanales</span>
              <div className={styles.metricValue}>{practicante.horasSemanales}</div>
              <div className={styles.metricSubtext}>80% completado</div>
            </div>
            <div className={styles.metricIcon} style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className={styles.metricCard} style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
          <div className={styles.metricContent}>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Asistencia</span>
              <div className={styles.metricValue}>{practicante.asistencia}</div>
              <div className={styles.metricSubtext}>Últimos 7 días</div>
            </div>
            <div className={styles.metricIcon} style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className={styles.metricCard} style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
          <div className={styles.metricContent}>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Infracciones</span>
              <div className={styles.metricValue}>{practicante.infracciones}</div>
              <div className={styles.metricSubtext}>Últimos 30 días</div>
            </div>
            <div className={styles.metricIcon} style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.skillsSection}>
        <h3>Habilidades Técnicas</h3>
        <div className={styles.skillsList}>
          {practicante.habilidades.map((skill, index) => (
            <span key={index} className={styles.skillBadge}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Modales */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        practicante={practicante}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <EditPractitionerModal
        isOpen={showEditModal}
        practicante={practicante}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}