import React from 'react'
import styles from './DisciplinaryTrackingView.module.css'
import { Download, Edit2 } from 'lucide-react'

// Importaciones a componentes locales del módulo
import ClassCard from '../components/ClassCard/ClassCard'
import SectionCard from '../components/SectionCard/SectionCard'
import WeekListGroup from '../components/WeekListGroup/WeekListGroup'


// Datos simulados para eventos de la semana
const eventosSemana = [
  {
    dia: "Lunes",
    actividades: [
      { hora: "08:00 - 10:00", actividad: "Reunión de equipo" },
      { hora: "10:30 - 12:00", actividad: "Desarrollo del módulo CRM" },
      { hora: "10:30 - 12:00", actividad: "Desarrollo del módulo CRM" },
    ],
  },
  {
    dia: "Martes",
    actividades: [
      { hora: "09:00 - 11:00", actividad: "Clases de desarrollo web" },
      { hora: "11:15 - 13:00", actividad: "Documentación técnica" },
      { hora: "11:15 - 13:00", actividad: "Documentación técnica" },
    ],
  },
  {
    dia: "Miércoles",
    actividades: [
      { hora: "08:00 - 09:30", actividad: "Planificación semanal" },
      { hora: "10:00 - 12:00", actividad: "Testing y QA" },
      { hora: "11:15 - 13:00", actividad: "Documentación técnica" },
    ],
  },
  
]  // Fin datos simulados

//Datos simulados para clases programadas
const clasesProgramadas = [
  {
    id: 1,
    titulo: "Matemáticas Avanzadas",
    instructor: "Dr. Juan Pérez",
    duracion: "2 horas",
  },
  {
    id: 2,
    titulo: "Historia del Arte",
    instructor: "Prof. María López",
    duracion: "1.5 horas",
  },
 

  
]
const clasesProgramadas1 = [
  {
    id: 1,
    titulo: "Jueves Londresd",
    instructor: "Dr. Juan Pérez",
    duracion: "5 horas",
  },
  {
    id: 2,
    titulo: "Guerra del Arte",
    instructor: "Prof. María López",
    duracion: "10 horas",
  },
  

]

export default function DisciplinaryTrackingView() {
  return (

    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Seguimiento Disciplinario</h1>
          <p className={styles.subtitle}>Revisa tus advertencias y estado disciplinario</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.btnPrimary}>
            <Download size={16} />
            <span>Descargar PDF</span>
          </button>
          <button className={styles.btnOutline}>
            <Edit2 size={16} />
            <span>Solicitar Cambio</span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className={styles.main}>
        
        {/* IZQUIERDA: Vista semanal */}
        <section className={styles.leftColumn}>
          <SectionCard title="Vista Semanal">
            <div className={styles.weekList}>
              {eventosSemana.map((grupo, idx) => (
                <WeekListGroup key={idx} {...grupo} />
              ))}
            </div>

            
          </SectionCard>
        </section>

        {/* DERECHA: Clases programadas */}
        <aside className={styles.rightColumn}>
          <SectionCard title="Clases Programadas">
            <div className={styles.classesGrid}>

              <div className={styles.fil1}>
              {clasesProgramadas.map((cl) => (
                <ClassCard key={cl.id} {...cl} />
              ))}
              </div>
              
              <div className={styles.fil2}>
                {clasesProgramadas1.map((cl) => (
                <ClassCard key={cl.id} {...cl} />
              ))}
              </div>
              
            </div>
            
          </SectionCard>
        </aside>
      </main>
    </div>
  )
}
