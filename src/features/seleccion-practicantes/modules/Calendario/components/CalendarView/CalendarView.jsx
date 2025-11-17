import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './CalendarView.module.css'

const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function CalendarView({ selectedDate, onDateSelect, scheduledDates = {} }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Obtener el primer día del mes y cuántos días tiene
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  // Ajustar para que la semana empiece en lunes (0 = domingo, 1 = lunes)
  const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

  // Generar array de días del mes
  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null) // Días vacíos antes del mes
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDateClick = (day) => {
    if (day) {
      const date = new Date(year, month, day)
      onDateSelect(date)
    }
  }

  const isSelected = (day) => {
    if (!day || !selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    )
  }

  const isToday = (day) => {
    if (!day) return false
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const isScheduled = (day) => {
    if (!day) return false
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return scheduledDates[dateKey] && !isToday(day)
  }

  const getScheduleType = (day) => {
    if (!day) return null
    if (isToday(day)) return 'today'
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return scheduledDates[dateKey]?.type || null
  }

  return (
    <div className={styles.container}>
      {/* Header del Calendario */}
      <div className={styles.header}>
        <button onClick={handlePreviousMonth} className={styles.navButton}>
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.monthYear}>
          {months[month]} {year}
        </h2>
        <button onClick={handleNextMonth} className={styles.navButton}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className={styles.daysHeader}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className={styles.calendarGrid}>
        {days.map((day, index) => {
          const scheduleType = getScheduleType(day)
          const scheduled = isScheduled(day)
          const selected = isSelected(day)
          const today = isToday(day)

          return (
            <div
              key={index}
              className={styles.calendarCell}
              onClick={() => handleDateClick(day)}
            >
              {day ? (
                <div
                  className={`
                    ${styles.dateCell}
                    ${today ? styles.today : ''}
                    ${selected ? styles.selected : ''}
                    ${scheduled ? styles[`scheduled_${scheduleType}`] || styles.scheduled : ''}
                    ${!scheduled && !selected && !today ? styles.default : ''}
                  `}
                >
                  <span className={styles.dateNumber}>{day}</span>
                </div>
              ) : (
                <div className={styles.emptyCell} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

