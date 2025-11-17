import { Calendar, AlertCircle } from 'lucide-react'
import styles from './CalendarWeekView.module.css'

const weekData = [
  {
    day: 'Lunes',
    count: 10,
    practitioners: [
      { name: 'Juan Pérez', server: 'Rpsoft', status: 'approved' },
      { name: 'María López', server: 'Innovacion', status: 'pending' },
      { name: 'Carlos Ruiz', server: 'Laboratorios', status: 'approved' },
      { name: 'Ana García', server: 'Rpsoft', status: 'approved' },
      { name: 'Luis Torres', server: 'MiniBootcamp', status: 'pending' },
      { name: 'Sofia Mendoza', server: 'Recuperacion', status: 'approved' },
      { name: 'Jorge Vega', server: 'Rpsoft', status: 'approved' },
      { name: 'Patricia Silva', server: 'Innovacion', status: 'approved' },
      { name: 'Roberto Díaz', server: 'Laboratorios', status: 'pending' },
      { name: 'Carmen Flores', server: 'Rpsoft', status: 'approved' }
    ]
  },
  {
    day: 'Martes',
    count: 15,
    practitioners: [
      { name: 'Diego Morales', server: 'Rpsoft', status: 'approved' },
      { name: 'Lucía Ramírez', server: 'Innovacion', status: 'approved' },
      { name: 'Fernando Castro', server: 'Laboratorios', status: 'pending' },
      { name: 'Valeria Ortiz', server: 'MiniBootcamp', status: 'approved' },
      { name: 'Andrés Herrera', server: 'Rpsoft', status: 'approved' },
      { name: 'Gabriela Núñez', server: 'Innovacion', status: 'approved' },
      { name: 'Ricardo Paredes', server: 'Laboratorios', status: 'pending' },
      { name: 'Daniela Rojas', server: 'Rpsoft', status: 'approved' },
      { name: 'Miguel Soto', server: 'Recuperacion', status: 'approved' },
      { name: 'Isabella Cruz', server: 'Innovacion', status: 'approved' },
      { name: 'Sebastián Vargas', server: 'Rpsoft', status: 'pending' },
      { name: 'Camila Reyes', server: 'Laboratorios', status: 'approved' },
      { name: 'Alejandro Guzmán', server: 'MiniBootcamp', status: 'approved' },
      { name: 'Valentina Medina', server: 'Rpsoft', status: 'approved' },
      { name: 'Nicolás Jiménez', server: 'Innovacion', status: 'pending' }
    ]
  },
  {
    day: 'Miércoles',
    count: 20,
    practitioners: Array.from({ length: 20 }, (_, i) => ({
      name: `Practicante ${i + 1}`,
      server: ['Rpsoft', 'Innovacion', 'Laboratorios', 'MiniBootcamp', 'Recuperacion'][i % 5],
      status: i % 3 === 0 ? 'pending' : 'approved'
    }))
  },
  {
    day: 'Jueves',
    count: 30,
    practitioners: Array.from({ length: 30 }, (_, i) => ({
      name: `Practicante ${i + 1}`,
      server: ['Rpsoft', 'Innovacion', 'Laboratorios', 'MiniBootcamp', 'Recuperacion'][i % 5],
      status: i % 4 === 0 ? 'pending' : 'approved'
    }))
  },
  {
    day: 'Viernes',
    count: 40,
    practitioners: Array.from({ length: 40 }, (_, i) => ({
      name: `Practicante ${i + 1}`,
      server: ['Rpsoft', 'Innovacion', 'Laboratorios', 'MiniBootcamp', 'Recuperacion'][i % 5],
      status: i % 5 === 0 ? 'pending' : 'approved'
    }))
  }
]

const getShortName = (fullName) => {
  const parts = fullName.split(' ')
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1]}`
  }
  return fullName
}

export function CalendarWeekView() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Calendar className={styles.headerIcon} size={28} strokeWidth={1} />
        <h2 className={styles.title}>Vista Semanal - Practicantes con Clases</h2>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendDotGreen}`} />
          <span>Aprobado (verde)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendDotRed}`} />
          <span>Pendiente (rojo)</span>
        </div>
        <div className={styles.legendItem}>
          <AlertCircle size={16} color="#2563eb" />
          <span>Todo el día (8am-2pm)</span>
        </div>
      </div>

      <div className={styles.weekGrid}>
        {weekData.map((dayData) => (
          <div key={dayData.day} className={styles.dayColumn}>
            <div className={styles.dayHeader}>
              <h3 className={styles.dayName}>{dayData.day}</h3>
              <p className={styles.dayCount}>
                {dayData.count} {dayData.count === 1 ? 'practicante' : 'practicantes'}
              </p>
            </div>

            <div className={styles.practitionersList}>
              {dayData.practitioners.map((practitioner, idx) => (
                <div
                  key={idx}
                  className={`${styles.practitionerCard} ${
                    practitioner.status === 'approved'
                      ? styles.practitionerNameApproved
                      : styles.practitionerNamePending
                  }`}
                >
                  <p className={styles.practitionerName}>{getShortName(practitioner.name)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
