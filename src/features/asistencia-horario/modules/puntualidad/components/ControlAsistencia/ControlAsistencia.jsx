import { Search, Filter } from 'lucide-react'
import styles from './ControlAsistencia.module.css'

const asistenciaData = [
  {
    id: 1,
    nombre: 'Carlos Méndoza',
    turno: 'Tarde',
    area: 'Tarde Adm.',
    horaEntrada: '8:02 a.m.',
    horaSalida: '24/30',
    estado: 'Presente',
    estadoColor: '#22c55e',
    estadoBg: '#ecfdf5',
    progress: 80
  },
  {
    id: 2,
    nombre: 'Ana Torres',
    turno: 'Innovación',
    area: 'Tarde Adm.',
    horaEntrada: '8:12 a.m.',
    horaSalida: '18/30',
    estado: 'Tardanza',
    estadoColor: '#f59e0b',
    estadoBg: '#fffbeb',
    progress: 60
  },
  {
    id: 3,
    nombre: 'Mario González',
    turno: 'Levantando',
    area: 'Tarde Adm.',
    horaEntrada: '-- : -- a.m.',
    horaSalida: '12/30',
    estado: 'Ausente (Sin justificar)',
    estadoColor: '#ef4444',
    estadoBg: '#fef2f2',
    progress: 40
  },
  {
    id: 4,
    nombre: 'Pedro Sánchez',
    turno: 'Modificando',
    area: 'Tarde Data',
    horaEntrada: '-- : -- a.m.',
    horaSalida: '18/30',
    estado: 'Ausente (Justificado)',
    estadoColor: '#f59e0b',
    estadoBg: '#fffbeb',
    progress: 60
  },
  {
    id: 5,
    nombre: 'Luis Ramírez',
    turno: 'Tarde',
    area: 'Tarde Adm.',
    horaEntrada: '7:58 a.m.',
    horaSalida: '10/30',
    estado: 'Presente',
    estadoColor: '#22c55e',
    estadoBg: '#ecfdf5',
    progress: 33
  }
]

export function ControlAsistencia() {
  return (
    <div className={styles.controlSection}>
      <h2 className={styles.sectionTitle}>Control de Asistencia Diaria</h2>
      
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Buscar por nombre" 
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <button className={styles.filterButton}>
            <Filter size={18} />
            Filtrar por: practicantes
          </button>
          
          <select className={styles.selectFilter}>
            <option>Todo en estado</option>
            <option>Presente</option>
            <option>Tardanza</option>
            <option>Ausente</option>
          </select>
          
          <button className={styles.linkButton}>
            5 practicantes deben venir hoy
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Turno</th>
              <th>Área</th>
              <th>Hora de entrada</th>
              <th>Horas acumuladas</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {asistenciaData.map(item => (
              <tr key={item.id}>
                <td className={styles.nombreCell}>{item.nombre}</td>
                <td>
                  <span className={styles.badge}>{item.turno}</span>
                </td>
                <td>
                  <span className={styles.badge}>{item.area}</span>
                </td>
                <td className={styles.horaCell}>{item.horaEntrada}</td>
                <td>
                  <div className={styles.progressContainer}>
                    <span className={styles.progressText}>{item.horaSalida}</span>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span 
                    className={styles.estadoBadge}
                    style={{
                      backgroundColor: item.estadoBg,
                      color: item.estadoColor
                    }}
                  >
                    {item.estado}
                  </span>
                </td>
                <td>
                  <button className={styles.detailsButton}>Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <div className={styles.autoExclusionNote}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="2"/>
            <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Sin Dato de equipo registrado hoy</span>
        </div>
      </div>
    </div>
  )
}
