import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare, Github, Linkedin, Award, Clock, TrendingUp, AlertTriangle, Users } from 'lucide-react'
import styles from './PerfilPracticante.module.css'

// Datos de ejemplo - en producción vendrían de una API
const practicantesData = {
  1: {
    nombre: 'Juan Pérez García',
    email: 'juan.perez@rpsoft.com',
    discord: 'juanperez#1234',
    avatar: 'JP',
    color: '#3b82f6',
    estado: 'Activo',
    rol: 'Elite',
    destacado: true,
    descripcion: 'Desarrollador Full Stack apasionado por crear soluciones innovadoras. Me encanta aprender nuevas tecnologías y compartir conocimiento con el equipo.',
    github: 'github.com/juanperez',
    linkedin: 'linkedin.com/in/juanperez',
    especializacion: 'Backend',
    servidor: 'Rpsoft',
    equipoActual: 'Team Alpha',
    scrum: 'Carlos Mendoza',
    cohorte: 'Cohorte 2024-A',
    fechaIngreso: '2024-01-15',
    scoreActual: 850,
    horasSemanales: '24/30',
    asistencia: '98%',
    infracciones: 0,
    habilidades: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Git']
  }
}

export function PerfilPracticante() {
  const { id } = useParams()
  const navigate = useNavigate()
  const practicante = practicantesData[id] || practicantesData[1]
  const [activeTab, setActiveTab] = useState('resumen')

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
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Cohorte</span>
            <span className={styles.infoValue}>{practicante.cohorte}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de ingreso</span>
            <span className={styles.infoValue}>{practicante.fechaIngreso}</span>
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

      <div className={styles.tabsSection}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'resumen' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('resumen')}
          >
            Resumen
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'evaluaciones' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('evaluaciones')}
          >
            Evaluaciones
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'historial' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('historial')}
          >
            Historial de Equipos
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'asistencia' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('asistencia')}
          >
            Asistencia
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'infracciones' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('infracciones')}
          >
            Infracciones
          </button>
        </div>
      </div>

      {activeTab === 'resumen' && (
        <div className={styles.resumeSection}>
          <h3>Resumen General</h3>
          <div className={styles.resumeGrid}>
            <div className={styles.resumeItem}>
              <span className={styles.resumeLabel}>Última actividad</span>
              <span className={styles.resumeValue}>2024-03-20</span>
            </div>
            <div className={styles.resumeItem}>
              <span className={styles.resumeLabel}>Progreso del Programa</span>
              <span className={styles.resumeValue}>Full Stack Development</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '75%' }}></div>
          </div>
          <span className={styles.progressText}>75% completado</span>
        </div>
      )}

      {activeTab === 'evaluaciones' && (
        <div className={styles.contentSection}>
          <h3>Historial de Evaluaciones</h3>
          <div className={styles.evaluacionesList}>
            <div className={styles.evaluacionItem}>
              <div className={styles.evaluacionHeader}>
                <div>
                  <h4>Hackathon Scrum - Semana 3</h4>
                  <p className={styles.evaluacionDate}>2024-03-10</p>
                  <p className={styles.evaluacionType}>Evaluación de Equipo</p>
                </div>
                <div className={styles.evaluacionScore}>
                  <span className={styles.scoreNumber}>9.2</span>
                  <span className={styles.scoreLabel}>/ 10</span>
                </div>
              </div>
              <p className={styles.evaluacionComment}>"Excelente trabajo en equipo y liderazgo técnico"</p>
            </div>
            <div className={styles.evaluacionItem}>
              <div className={styles.evaluacionHeader}>
                <div>
                  <h4>Evaluación Individual</h4>
                  <p className={styles.evaluacionDate}>2024-03-05</p>
                  <p className={styles.evaluacionType}>Evaluación Individual</p>
                  <p className={styles.evaluador}>Evaluador: Carlos Mendoza</p>
                </div>
                <div className={styles.evaluacionScore}>
                  <span className={styles.scoreNumber}>8.8</span>
                  <span className={styles.scoreLabel}>/ 10</span>
                </div>
              </div>
              <p className={styles.evaluacionComment}>"Muy buen progreso en habilidades técnicas"</p>
            </div>
            <div className={styles.evaluacionItem}>
              <div className={styles.evaluacionHeader}>
                <div>
                  <h4>Peer Review Sprint 2</h4>
                  <p className={styles.evaluacionDate}>2024-02-28</p>
                  <p className={styles.evaluacionType}>Evaluación Peer-to-Peer</p>
                </div>
                <div className={styles.evaluacionScore}>
                  <span className={styles.scoreNumber}>9</span>
                  <span className={styles.scoreLabel}>/ 10</span>
                </div>
              </div>
              <p className={styles.evaluacionComment}>"Colaborativo y siempre dispuesto a ayudar"</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className={styles.contentSection}>
          <h3>Historial de Equipos</h3>
          <div className={styles.equiposList}>
            <div className={styles.equipoItem}>
              <div className={styles.equipoIcon}>
                <Users size={24} color="#3b82f6" />
              </div>
              <div className={styles.equipoInfo}>
                <h4>Team Alpha</h4>
                <p className={styles.equipoRole}>Rol: Developer</p>
                <p className={styles.equipoDate}>2024-01-15 - Presente</p>
              </div>
              <div className={styles.equipoStatus}>
                <span className={styles.statusBadgeActual}>Actual</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'asistencia' && (
        <div className={styles.contentSection}>
          <h3>Registro de Asistencia</h3>
          <p className={styles.emptyMessage}>Contenido de asistencia próximamente...</p>
        </div>
      )}

      {activeTab === 'infracciones' && (
        <div className={styles.contentSection}>
          <h3>Registro de Infracciones</h3>
          <p className={styles.emptyMessage}>No hay infracciones registradas</p>
        </div>
      )}
    </div>
  )
}